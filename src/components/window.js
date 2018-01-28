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
            error: null,
            latitude: null,
            longitude: null,
            altitude: null,
            direction: null
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

    componentWillUpdate(nextProps, nextState) {
    }

    portHandler(port) {
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
        if (/:START#/.test(data)) this.currentPort.status.start = true;
        if (/:START@OK#/.test(data)) this.currentPort.status.startok = true;

        if (this.currentPort.status.start) this.currentPort.object.write(':START@OK#');
        if (!this.currentPort.status.startok) this.currentPort.object.write(':START#');

        if (this.currentPort.status.start && this.currentPort.status.startok) {
            this.currentPort.object.removeAllListeners();
            this.currentPort.object.on('data', this.dataHandler)
            this.setState({ currentPage: pages.loadingMap });
            console.log('Connection established')
        }
    }

    dataHandler(data) {
        let lat = /:LAT(\d{1,2}\.\d{6})#/.exec(data)
        let lon = /:LON(\d{1,2}\.\d{6})#/.exec(data)
        let alt = /:ALT(\d{1,6})#/.exec(data)
        let dir = /:DIR(-?\d{1,2}\.\d{6})#/.exec(data)
        if (lat || lon || alt || dir)
            this.setState({
                latitude: lat ? parseFloat(lat[1]) : this.state.latitude,
                longitude: lon ? parseFloat(lon[1]) : this.state.longitude,
                altitude: alt ? parseInt(alt[1]) : this.state.altitude,
                direction: dir ? parseFloat(dir[1]) : this.state.direction,
            })
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
                        latitude={this.state.latitude}
                        longitude={this.state.longitude}
                        altitude={this.state.altitude}
                        direction={this.state.direction}
                    /> : null}
            </div>
        );
    }
}