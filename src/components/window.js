'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const SerialPort = window.require('serialport');

import ConnectScreen from './connectscreen.js';
import Loading from './loading.js';
import MapScreen from './mapscreen.js';

const pages = { connect: 'connect', connecting: 'connecting', loadingMap: 'loadingMap', map: 'map' };

export default class Window extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: pages.connect,
            error: null
        }
        this.currentPort = {
            object: null,
            info: {},
            status: { start: false, startok: false }
        }
        this.portHandler = this.portHandler.bind(this);
        this.connectionHandler = this.connectionHandler.bind(this);
        this.dataHandler = this.dataHandler.bind(this);
        this.mapHandler = this.mapHandler.bind(this);
    }

    portHandler(port) {
        console.log(port.comName);
        this.currentPort.object = new SerialPort(port.comName,
            { baudRate: 9600, parser: SerialPort.parsers.readline(/(:.*#)/) },
            err => {
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
                this.setState({ currentPage: pages.connecting })

                //events
                this.currentPort.object.on('error', err => {
                    this.setState({ error: err.message })
                })
                this.currentPort.object.on('data', this.connectionHandler)
            });
    }

    connectionHandler(data) {
        console.log(data)

        if (this.currentPort.status.start) this.currentPort.object.write(':START@OK#');
        else this.currentPort.status.start = /:START#/.test(data);

        if (this.currentPort.status.startok) this.currentPort.object.write(':START#');
        else this.currentPort.status.startok = /:START@OK#/.test(data);

        if (this.currentPort.status.start && this.currentPort.status.startok) {
            this.currentPort.object.removeAllListeners();
            this.currentPort.object.on('data', this.dataHandler)
            this.setState({ currentPage: pages.loadingMap });
            console.log('ok')
        }
    }

    dataHandler(data) {
        console.log(data)
    }

    mapHandler() {
        this.setState({ currentPage: pages.map })
    }


    render() {
        return (
            <div>
                {this.state.currentPage === pages.connect || this.state.currentPage === pages.connecting ?
                    <ConnectScreen
                        portHandler={this.portHandler}
                    /> : null}
                {this.state.currentPage === pages.connecting || this.state.currentPage === pages.loadingMap ?
                    <Loading /> : null}
                {this.state.currentPage === pages.map || this.state.currentPage === pages.loadingMap ?
                    <MapScreen
                        mapHandler={this.mapHandler}
                    /> : null}
            </div>
        );
    }
}