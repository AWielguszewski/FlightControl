'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const mapboxgl = window.require('mapbox-gl/dist/mapbox-gl.js');
import Mapkey from '../mapkey.js'

export default class Map extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        mapboxgl.accessToken = Mapkey;
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9'
        });

        this.map.on('load', () => {
            this.props.mapHandler();
            this.map.easeTo({
                zoom: 8,
                center: [22.004571, 50.037532],
                duration: 3000
            })
        })
    }

    render() {
        return <section id="map" className="map" >
        </section>
    }
}