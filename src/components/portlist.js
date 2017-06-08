'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const SerialPort = window.require('serialport');

export default class PortList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ports: [],
        };
        this.refreshList = this.refreshList.bind(this);
    }

    refreshList() {
        SerialPort.list((err, ports) => {
            if (err) console.log('Error in SerialPort.list()');
            else this.setState({ ports: ports })
        })
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.refreshList(),
            1000
        );
        console.log('mounting ' + this.timerID)
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        console.log('clearing ' + this.timerID)
    }

    render() {
        let ports = this.state.ports;
        return <div className={this.props.class} >
            {
                ports.length ?
                    ports.map(port => {
                        let key = port.serialNumber || port.vendorId || port.productId || port.manufacturer;
                        return <div
                            key={key}
                            className={'port-list-item'}
                            onClick={() => { this.props.portHandler(port) }} >
                            <div className={'port-list-item-com'}>
                                {port.comName}
                            </div>
                            <div className={'port-list-item-desc'}>
                                {port.manufacturer}
                            </div>
                        </div>
                    })
                    :
                    <div className={'port-list-info'}>
                        {'no devices detected'}
                    </div>
            }
        </div>
    }
}