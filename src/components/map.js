'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const mapboxgl = window.require('mapbox-gl/dist/mapbox-gl.js');
import Mapkey from '../mapkey.js'
import { lineDistance } from '@turf/turf'
import { colors } from '../constants';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.point = {
            "type": "Point",
            "coordinates": [-74.50, 40]
        }
        this.geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        this.linestring = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": []
            }
        }
        this.firstPoints = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[], []]
                }
            }]
        }
        this.state = {
            loaded: false,
            disabled: false
        }
        this.reloadMap = this.reloadMap.bind(this)
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        this.mouseClickHandler = this.mouseClickHandler.bind(this)
    }

    mouseMoveHandler(e) {
        if (this.props.planning) {
            const features = this.map.queryRenderedFeatures(e.point, { layers: ['measure-points'] })
            this.props.onCursorPointChange({ x: e.lngLat.lng, y: e.lngLat.lat })
            this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : 'crosshair'
        }
    }

    mouseClickHandler(e) {
        if (this.props.planning) {
            const features = this.map.queryRenderedFeatures(e.point, { layers: ['measure-points'] })
            if (this.geojson.features.length > 1) this.geojson.features.pop()
            if (features.length) {
                const id = features[0].properties.id;
                this.geojson.features = this.geojson.features.filter(point => {
                    return point.properties.id !== id;
                })
            } else {
                const point = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            e.lngLat.lng,
                            e.lngLat.lat
                        ]
                    },
                    "properties": {
                        "id": String(new Date().getTime())
                    }
                }
                this.geojson.features.push(point)
            }
            if (this.geojson.features.length > 1) {
                this.linestring.geometry.coordinates = this.geojson.features.map(point => {
                    return point.geometry.coordinates
                })
                this.geojson.features.push(this.linestring)
                this.props.onPlannedDistanceChange(lineDistance(this.linestring).toLocaleString())
            }
            this.map.getSource('geojson').setData(this.geojson)
            this.firstPoints.features[0].geometry.coordinates[1] = this.geojson.features[0] ? this.geojson.features[0].geometry.coordinates : []
            this.map.getSource('firstPoints').setData(this.firstPoints)
        }
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
                this.firstPoints.features[0].geometry.coordinates[0] = this.point.coordinates
                this.map.getSource('firstPoints').setData(this.firstPoints)
                this.map.getSource('drone').setData(this.point)
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
            })

            this.map.addLayer({
                "id": "drone-glow",
                "type": "circle",
                "source": "drone",
                "paint": {
                    "circle-radius": 40,
                    "circle-color": "#fff",
                    "circle-opacity": 0.1
                }
            })

            this.map.addLayer({
                "id": "drone",
                "type": "symbol",
                "source": "drone",
                "layout": {
                    "icon-image": "airport-15",
                    "icon-rotation-alignment": "map"
                }
            })

            this.map.addSource('geojson', {
                "type": "geojson",
                "data": this.geojson
            })
            this.map.addSource('firstPoints', {
                "type": "geojson",
                "data": this.firstPoints
            })
            this.map.addLayer({
                id: 'measure-points',
                type: 'circle',
                source: 'geojson',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#000'
                },
                filter: ['in', '$type', 'Point']
            })
            this.map.addLayer({
                id: 'measure-lines',
                type: 'line',
                source: 'geojson',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                paint: {
                    'line-color': '#000',
                    'line-width': 2.5
                },
                filter: ['in', '$type', 'LineString']
            })

            this.map.addLayer({
                id: 'dotted',
                type: 'line',
                source: 'firstPoints',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                paint: {
                    'line-dasharray': [4, 4],
                    'line-color': colors.color2,
                    'line-width': 2.5
                },
                filter: ['in', '$type', 'LineString']
            })

            this.map.on('mousemove', this.mouseMoveHandler)

            this.map.on('click', this.mouseClickHandler)

            this.setState({ loaded: true })
        });
    }

    render() {
        return <section id="map" className="map" >
        </section>
    }
}