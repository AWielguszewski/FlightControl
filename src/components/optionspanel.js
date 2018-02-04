'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import { VictoryArea, VictoryChart, VictoryTheme } from 'victory'
import { slide as BurgerMenu } from 'react-burger-menu'
import { Radio, Menu, Icon, Button, Checkbox } from 'antd'
import moment from 'moment'
const RadioGroup = Radio.Group
const SubMenu = Menu.SubMenu
const fs = require('fs')
const os = require("os")
import { colors } from '../constants'

export default class OptionsPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openKeys: [],
            altitudeTab: [],
            altitudeDataTab: [],
            loggingEnabled: true,
            logCoordinates: true,
            logAltitude: true,
            logDistance: true
        }
        this.loggingFileName = moment().format('YYYYMMDDHHmmss')
        this.writeStream = fs.createWriteStream(`logs/${this.loggingFileName}.txt`)
        this.rootSubmenuKeys = ['options', 'graphs', 'logs']
        this.onOpenChange = this.onOpenChange.bind(this)
    }

    componentWillUnmount() {
        this.writeStream.end()
        clearInterval(this.intervalId)
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            if (this.state.loggingEnabled) {
                let output = `${moment().format('HH:mm:ss')}   `
                if (this.state.logCoordinates && this.props.latitude && this.props.longitude)
                    output += `coordinates: [${this.props.longitude} , ${this.props.latitude}]`
                if (this.state.logAltitude && this.props.altitude)
                    output += `  altitude: ${this.props.altitude}m`
                if (this.state.logDistance && this.props.distance)
                    output += `  distance: ${this.props.distance.toPrecision(2)}km`
                output += os.EOL
                this.writeStream.write(output)
            }
        }, 1000)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.altitude) {
            if (this.state.altitudeTab.length < 10) {
                const newTab = this.state.altitudeTab
                newTab.push(nextProps.altitude)
                const newDataTab = newTab.map((item, index) => { return { x: index, y: item } })
                this.setState({
                    altitudeTab: newTab,
                    altitudeDataTab: newDataTab
                })
            }
            if (this.state.altitudeTab.length === 10) {
                let newTab = this.state.altitudeTab
                newTab.shift()
                newTab.push(nextProps.altitude)
                const newDataTab = newTab.map((item, index) => { return { x: index, y: item } })
                this.setState({
                    altitudeTab: newTab,
                    altitudeDataTab: newDataTab
                })
            }
        }
    }

    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        return (
            <BurgerMenu {...this.props}>
                <Menu
                    mode="inline"
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    style={menuStyle}
                >
                    <SubMenu key="options" title={<span><Icon type="setting" /><span>Map styles</span></span>}>
                        <RadioGroup style={radioGroupStyle} onChange={this.props.onStyleChange} defaultValue={this.props.currentStyle}>
                            <Radio style={radioStyle} value={'basic'}>Basic</Radio>
                            <Radio style={radioStyle} value={'streets'}>Streets</Radio>
                            <Radio style={radioStyle} value={'bright'}>Bright</Radio>
                            <Radio style={radioStyle} value={'light'}>Light</Radio>
                            <Radio style={radioStyle} value={'dark'}>Dark</Radio>
                            <Radio style={radioStyle} value={'satellite'}>Satellite</Radio>
                        </RadioGroup>
                    </SubMenu>
                    <SubMenu key="graphs" title={<span><Icon type="area-chart" /><span>Statistics</span></span>}>
                        <Menu.Item key="1"><span><Icon type="share-alt" /><span>{`Distance covered: ${this.props.distance.toPrecision(2)} km`}</span></span></Menu.Item>
                        <Menu.Item key="2"><span><Icon type="to-top" /><span>{`Current altitude: ${this.props.altitude} m`} </span></span></Menu.Item>
                        <Menu.Item key="3"><span><Icon type="line-chart" /><span>{`Altitude chart:`} </span></span></Menu.Item>
                        <VictoryChart
                            theme={VictoryTheme.material}
                        >
                            <VictoryArea
                                style={{ data: { fill: colors.color2 } }}
                                domain={{ x: [0, 10], y: [0, Math.max(...this.state.altitudeTab) / 0.8] }}
                                data={this.state.altitudeDataTab}
                            />
                        </VictoryChart>
                    </SubMenu>
                    <SubMenu key="logs" title={<span><Icon type="download" /><span>Logs</span></span>}>
                        <Menu.Item key="1">
                            <Button
                                style={buttonStyle}
                                type="primary"
                                size={'large'}
                                onClick={() => this.setState({ loggingEnabled: !this.state.loggingEnabled })}
                            >
                                {this.state.loggingEnabled ? 'Disable logging' : 'Enable logging'}
                            </Button>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Checkbox
                                checked={this.state.logCoordinates}
                                disabled={!this.state.loggingEnabled}
                                onChange={() => this.setState({ logCoordinates: !this.state.logCoordinates })}>
                                {'Log coordinates'}
                            </Checkbox>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Checkbox
                                checked={this.state.logAltitude}
                                disabled={!this.state.loggingEnabled}
                                onChange={() => this.setState({ logAltitude: !this.state.logAltitude })}>
                                {'Log altitude'}
                            </Checkbox>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Checkbox
                                checked={this.state.logDistance}
                                disabled={!this.state.loggingEnabled}
                                onChange={() => this.setState({ logDistance: !this.state.logDistance })}>
                                {'Log distance'}
                            </Checkbox>
                        </Menu.Item>
                        {
                            this.state.loggingEnabled ? <Menu.Item key="5">{`file: ${this.loggingFileName}.txt`}</Menu.Item> : null
                        }
                    </SubMenu>
                </Menu>
            </BurgerMenu >
        )
    }
}

const buttonStyle = {
    backgroundColor: colors.color2,
    borderColor: colors.color1,
    color: colors.color1
}

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    color: colors.color2
}

const menuStyle = {
    backgroundColor: 'transparent',
    borderColor: 'transparent'
}

const radioGroupStyle = {
    marginLeft: '40px'
} 
