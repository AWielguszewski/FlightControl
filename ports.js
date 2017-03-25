'use strict'

const SerialPort = require('serialport');
let connected;

SerialPort.list((err, ports) => {
    const portList = document.getElementById('ports');
    for (const port of ports) {
        let newElement = document.createElement('li');
        let newContent = document.createTextNode(`${port.comName} (${port.manufacturer})`);
        newElement.appendChild(newContent);
        portList.appendChild(newElement);
    }
})

const initialize = new Promise((resolve, reject) => {
    connected = new SerialPort('COM3', { autoOpen: false });
    if (connected) {
        console.log(`Port '${connected.path}' created. Awaiting opening..`);
        resolve(true);
    } else {
        reject(new Error('Cannot initialize port'));
    }
});