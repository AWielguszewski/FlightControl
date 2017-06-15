'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Image from './image.js';

export default function Loading(props) {
    return (
        <section className="loading" >
            <div className="cssload-container loading-spinner">
                <div className="cssload-speeding-wheel"></div>
            </div>
        </section>
    );
}