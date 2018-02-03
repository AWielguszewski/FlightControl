'use strict';

import React from 'react'
import ReactDOM from 'react-dom'
import { slide as BurgerMenu } from 'react-burger-menu'
import { Radio, Menu, Icon } from 'antd'
const RadioGroup = Radio.Group
const SubMenu = Menu.SubMenu
import { colors } from '../constants'

export default class OptionsPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openKeys: []
        }
        this.rootSubmenuKeys = ['options', 'graphs', 'logs']
        this.onOpenChange = this.onOpenChange.bind(this)
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
                    </SubMenu>
                    <SubMenu key="logs" title={<span><Icon type="download" /><span>Logs</span></span>}>
                    </SubMenu>
                </Menu>
            </BurgerMenu>
        )
    }
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
