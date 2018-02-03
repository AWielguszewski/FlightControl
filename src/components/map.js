'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const mapboxgl = window.require('mapbox-gl/dist/mapbox-gl.js');
import Mapkey from '../mapkey.js'

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.point = {
            "type": "Point",
            "coordinates": [-74.50, 40]
        }
        this.state = {
            loaded: false,
            disabled: false
        }
        this.reloadMap = this.reloadMap.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.map && this.state.loaded) {
            if (this.props.currentStyle !== nextProps.currentStyle) {
                this.setState({ loaded: false })
                this.reloadMap(nextProps.currentStyle)
            }
            else {
                this.point.coordinates[0] = this.props.longitude
                this.point.coordinates[1] = this.props.latitude
                this.map.getSource('drone').setData(this.point);
                this.map.setLayoutProperty('drone', 'icon-rotate', this.props.direction * (180 / Math.PI));
                if (nextProps.lockedToCenter) {
                    if ((this.props.lockedToCenter || nextProps.lockedToCenter) && !this.state.disabled) {
                        this.map.boxZoom.disable()
                        this.map.scrollZoom.disable()
                        this.map.dragPan.disable()
                        this.map.dragRotate.disable()
                        this.map.keyboard.disable()
                        this.map.doubleClickZoom.disable()
                        this.map.touchZoomRotate.disable()
                        this.setState({ disabled: true })
                    }
                    this.map.easeTo({
                        center: this.point.coordinates,
                        zoom: 16,
                        duration: 100
                    })
                }
                else if ((!this.props.lockedToCenter || !nextProps.lockedToCenter) && this.state.disabled) {
                    this.map.boxZoom.enable()
                    this.map.scrollZoom.enable()
                    this.map.dragPan.enable()
                    this.map.dragRotate.enable()
                    this.map.keyboard.enable()
                    this.map.doubleClickZoom.enable()
                    this.map.touchZoomRotate.enable()
                    this.setState({ disabled: false })
                }
            }
        }
    }

    componentDidMount() {
        this.reloadMap(this.props.currentStyle)
    }

    reloadMap(style) {
        mapboxgl.accessToken = Mapkey;
        this.map = new mapboxgl.Map({
            container: 'map',
            interactive: !this.props.lockedToCenter,
            style: `mapbox://styles/mapbox/${style}-v9`
        });
        this.map.on('load', () => {
            this.props.mapHandler()
            this.map.addSource('drone', { type: 'geojson', data: this.point })

            this.map.addLayer({
                "id": "drone-glow-strong",
                "type": "circle",
                "source": "drone",
                "paint": {
                    "circle-radius": 18,
                    "circle-color": "#fff",
                    "circle-opacity": 0.4
                }
            });

            this.map.addLayer({
                "id": "drone-glow",
                "type": "circle",
                "source": "drone",
                "paint": {
                    "circle-radius": 40,
                    "circle-color": "#fff",
                    "circle-opacity": 0.1
                }
            });

            this.map.addLayer({
                "id": "drone",
                "type": "symbol",
                "source": "drone",
                "layout": {
                    "icon-image": "airport-15",
                    "icon-rotation-alignment": "map"
                }
            });

            this.setState({ loaded: true })
        });
    }

    render() {
        return <section id="map" className="map" >
        </section>
    }
}