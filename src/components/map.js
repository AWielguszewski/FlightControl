'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const mapboxgl = window.require('mapbox-gl/dist/mapbox-gl.js');

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.mapKey = 'pk.eyJ1IjoiYXdpZWxndXN6ZXdza2kiLCJhIjoiY2oyN21hMWY5MDA1djMycXFueG1zd2Q2dSJ9.yI3n921FjI46G9hLbEOpIQ';
    }

    componentDidMount() {
        mapboxgl.accessToken = this.mapKey;
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9'
        });

        this.map.on('load', () => { this.props.mapHandler() })
    }

    render() {
        return <section id="map" className="map" >
        </section>
    }
}