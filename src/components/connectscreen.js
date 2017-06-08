'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Image from './image.js';
import PortList from './portlist.js';

export default function ConnectScreen(props) {
    return (
        <section className="middle-panel" >
            <Image
                class="top-logo"
                path="../assets/SVG/top_logo.svg"
                onClick={null}
            />
            <PortList
                class="port-list"
                portHandler={props.portHandler}
            />
            <Image
                class="bottom-logo"
                path="../assets/SVG/bottom_logo.svg"
                onClick={null}
            />
        </section>
    );
}