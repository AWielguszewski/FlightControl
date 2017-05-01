'use strict'

const SerialPort = require('serialport')
const { ipcRenderer } = require('electron')

let currentTimeoutID = '';

ipcRenderer.on('domrdy', (event, msg) => {
    console.log(msg);
    document.querySelector('.refresh_container').addEventListener('click', () => createList());
})

function createList() {
    if (currentTimeoutID != '') window.clearTimeout(currentTimeoutID);
    loadPortList()
        //then cos tam
        .catch((error) => {
            console.log(`Error when creating list: ${error}`);
        })
}

function loadPortList() {
    return new Promise((resolve, reject) => {
        SerialPort.list((err, ports) => {
            if (err) { reject(err.message) }
            else if (!ports.length) { emptyList(); reject('Nothing connected'); }
            else {
                if (ports.length == 1) { changeInfo('1 port available') }
                else { changeInfo(`${ports.length} ports available`) }
                for (let i = 0; i < ports.length; i++) { createPortListItem(i, ports[i]) }
            }
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
    let portList = document.querySelector('.list');
    portList.innerHTML = '';
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
    })
}

function emptyList() {
    let portList = document.querySelector('.list');
    portList.innerHTML = '';
    changeInfo('no available devices have been detected');
    currentTimeoutID = setTimeout(() => changeInfo('hit refresh to update the port list'), 2000);
    console.log('creating empty list');
}

function changeInfo(text) {
    document.getElementById('list_info_text').innerHTML = `<i>${text}</i>`;
}
