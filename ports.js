'use strict'

const SerialPort = require('serialport')
const { ipcRenderer } = require('electron')

ipcRenderer.on('domrdy', (event, msg) => {
    console.log(msg);
    //animacja wczytania tla
    loadPortList()
        //then() animacja pojawienia sie listy
        .catch((errMsg) => {
            console.log(errMsg)
        })
})

function loadPortList() {
    return new Promise((resolve, reject) => {
        console.log('w loadportlist');
        SerialPort.list((err, ports) => {
            if (err) { reject(err.message) }
            if (!ports.length) { createEmptyList(); reject('Nothing connected'); }
            console.log(`liczba portow: ${ports.length}`);
            console.log(ports);
            for (let i = 0; i < ports.length; i++) { createPortListItem(i, ports[i]) }
        })
    });
}

function connectToCOM() {
    return new Promise((resolve, reject) => {
        console.log('test3');
        const connected = new SerialPort('COM3', { autoOpen: false });
        if (connected) {
            console.log(`Port '${connected.path}' created. Awaiting opening..`);
            resolve(true);
        } else {
            reject('Cannot connect to port');
        }
    });
}

function createPortListItem(i, port) {
    let portList = document.getElementById('port_list');
    console.log(portList);
    let txtContent;

    let portListItem = document.createElement('div');
    portListItem.setAttribute('id', `port_list_item_${i}`);
    portListItem.setAttribute('class', 'port_list_item');

    let portListItemCOM = document.createElement('div');
    portListItemCOM.setAttribute('class', 'port_list_item_COM');
    txtContent = document.createTextNode(`${port.comName}`);
    portListItemCOM.appendChild(txtContent);

    let portListItemDESC = document.createElement('div');
    portListItemDESC.setAttribute('class', 'port_list_item_DESC');
    txtContent = document.createTextNode(`${port.manufacturer}`);
    portListItemDESC.appendChild(txtContent);

    portListItem.appendChild(portListItemCOM);
    portListItem.appendChild(portListItemDESC);

    portList.appendChild(portListItem);

    document.getElementById(`port_list_item_${i}`).addEventListener('click', () => {
        console.log('ss');
        let elem = document.getElementById(`port_list_item_${i}`)
        elem.style.backgroundColor = 'white';
        elem.style.border = 'white 1px solid';
    })
}

function createEmptyList() {
    //empty list
    console.log('creating empty list');
}
