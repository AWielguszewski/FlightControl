'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd'

import OptionsPanel from './optionspanel.js';
import Map from './map.js';
import { colors } from '../constants'

export default class MapScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lockedToCenter: true
        }
    }

    render() {
        return (
            <section id='outer-container' className="map-screen" >
                <OptionsPanel outerContainerId={'outer-container'} pageWrapId={'page-wrap'} />
                <Map
                    id='page-wrap'
                    lockedToCenter={this.state.lockedToCenter}
                    {...this.props}
                />
                <Button
                    style={buttonStyle}
                    type="primary"
                    shape="circle"
                    icon={this.state.lockedToCenter ? 'unlock' : 'lock'}
                    size={'large'}
                    onClick={() => this.setState({ lockedToCenter: !this.state.lockedToCenter })}
                />
            </section>
        )
    }
}

const buttonStyle = {
    backgroundColor: colors.color1,
    borderColor: colors.color2,
    position: 'fixed',
    bottom: '30px',
    right: '10px'
}