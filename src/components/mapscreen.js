'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd'
import { lineDistance } from '@turf/turf'

import OptionsPanel from './optionspanel.js';
import Map from './map.js';
import { colors } from '../constants'

export default class MapScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lockedToCenter: true,
            currentStyle: 'basic',
            distance: 0.0
        }
        this.onStyleChange = this.onStyleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.longitude && this.props.latitude && nextProps.longitude && nextProps.latitude) {
            const prevPoint = [parseFloat(this.props.longitude), parseFloat(this.props.latitude)]
            const nextPoint = [parseFloat(nextProps.longitude), parseFloat(nextProps.latitude)]
            const line = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [prevPoint, nextPoint]
                }
            }
            const newDistance = lineDistance(line, { units: 'kilometers' })
            this.setState({ distance: this.state.distance + newDistance })
        }
    }

    onStyleChange(e) {
        this.setState({ currentStyle: e.target.value })
    }

    render() {
        return (
            <section id='outer-container' className="map-screen" >
                <OptionsPanel
                    outerContainerId={'outer-container'}
                    pageWrapId={'page-wrap'}
                    currentStyle={this.state.currentStyle}
                    onStyleChange={this.onStyleChange}
                    distance={this.state.distance}
                />
                <Map
                    id='page-wrap'
                    lockedToCenter={this.state.lockedToCenter}
                    {...this.props}
                    currentStyle={this.state.currentStyle}
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