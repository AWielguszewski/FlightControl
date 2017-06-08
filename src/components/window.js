'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const SerialPort = window.require('serialport');

import ConnectScreen from './connectscreen.js';


export default class Window extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            error: null
        }
        this.currentPort = {
            object: null,
            info: {}
        }
        this.portHandler = this.portHandler.bind(this);
    }

    portHandler(port) {
        console.log(port.comName);
        this.currentPort.object = new SerialPort(port.comName, err => {
            if (err) {
                return this.setState({ error: err.message })
            }
            this.currentPort.info = {
                comName: port.comName,
                manufacturer: port.manufacturer,
                serialNumber: port.serialNumber,
                vendorId: port.vendorId,
                productId: port.productId
            }
            this.setState({ isOpen: true })
        });
    }

    render() {
        this.state.isOpen ? console.log(this.currentPort.info.manufacturer) : console.log('nothing');
        return (
            <ConnectScreen
                portHandler={this.portHandler}
            />
        );
    }
}