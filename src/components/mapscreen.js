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
            distance: 0.0,
            planning: false,
            cursorPoint: {
                x: '0',
                y: '0'
            },
            plannedDistance: 0
        }
        this.onStyleChange = this.onStyleChange.bind(this)
        this.onCursorPointChange = this.onCursorPointChange.bind(this)
        this.onPlannedDistanceChange = this.onPlannedDistanceChange.bind(this)
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

    onPlannedDistanceChange(distance) {
        this.setState({ plannedDistance: distance })
    }

    onStyleChange(e) {
        this.setState({ currentStyle: e.target.value })
    }

    onCursorPointChange(point) {
        this.setState({ cursorPoint: point })
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
                    altitude={this.props.altitude}
                    latitude={this.props.latitude}
                    longitude={this.props.longitude}
                />
                <Map
                    id='page-wrap'
                    lockedToCenter={this.state.lockedToCenter}
                    {...this.props}
                    currentStyle={this.state.currentStyle}
                    planning={this.state.planning}
                    onCursorPointChange={this.onCursorPointChange}
                    onPlannedDistanceChange={this.onPlannedDistanceChange}
                />
                <Button
                    style={buttonStyle2}
                    type="primary"
                    shape="circle"
                    icon={this.state.planning ? 'close' : 'share-alt'}
                    size={'large'}
                    onClick={() => this.setState({ planning: !this.state.planning, lockedToCenter: this.state.planning })}
                />
                <Button
                    style={buttonStyle}
                    disabled={this.state.planning}
                    type="primary"
                    shape="circle"
                    icon={this.state.lockedToCenter ? 'unlock' : 'lock'}
                    size={'large'}
                    onClick={() => this.setState({ lockedToCenter: !this.state.lockedToCenter })}
                />
                {
                    this.state.planning ?
                        <div style={pointStyle}>
                            <span style={{ color: colors.color2 }}>{`cursor: [${this.state.cursorPoint.x},${this.state.cursorPoint.y}]`}</span>
                        </div>
                        : null
                }
                {
                    this.state.planning ?
                        <div style={pointStyle2}>
                            <span style={{ color: colors.color2 }}>{`distance: ${this.state.plannedDistance}km`}</span>
                        </div>
                        : null
                }
            </section>
        )
    }
}

const pointStyle = {
    position: 'fixed',
    backgroundColor: colors.color1_soft,
    height: '30px',
    minWidth: '100px',
    padding: '5px',
    top: '10px',
    right: '10px'
}

const pointStyle2 = {
    position: 'fixed',
    backgroundColor: colors.color1_soft,
    height: '30px',
    minWidth: '120px',
    padding: '5px',
    top: '50px',
    right: '10px'
}

const buttonStyle = {
    backgroundColor: colors.color1,
    borderColor: colors.color2,
    position: 'fixed',
    bottom: '30px',
    right: '10px'
}

const buttonStyle2 = {
    backgroundColor: colors.color1,
    borderColor: colors.color2,
    position: 'fixed',
    bottom: '90px',
    right: '10px'
}