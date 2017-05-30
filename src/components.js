'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export class Window extends React.Component {
    constructor() {
        super();
        //state
    }
    //methods
    render() {
        return (
            <div>{'cos'}</div>
        );
    }
}

export function ConnectScreen(props) {
    return
}

export function PortList(props) {
    return
}

export function PortListItem(props) {
    return
}

export function Image(props) {
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

export function Loading(props) {
    return
}

export function MapScreen(props) {
    return
}

export function OptionsPanel(props) {

}
