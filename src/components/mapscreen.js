'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import OptionsPanel from './optionspanel.js';
import Map from './map.js';

export default function MapScreen(props) {
    return (
        <section className="map-screen" >
            {/*<OptionsPanel />*/}
            <Map
                mapHandler={props.mapHandler}
            />
        </section>
    );
}