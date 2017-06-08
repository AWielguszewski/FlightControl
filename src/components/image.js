'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export default function Image(props) {
    return (
        <div className={props.class}>
            {props.onClick === null ?
                <img src={props.path} />
                :
                <img src={props.path} onClick={() => props.onClick(props.id)} />
            }
        </div>
    );
}