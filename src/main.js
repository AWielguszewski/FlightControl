'use strict';

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let win

/**
 * Creating the main window.
 * 800x600
 */
function createWindow() {
    win = new BrowserWindow({
        minWidth: 500,
        minHeight: 600,
        height: 600,
        width: 1280,
        backgroundColor: '#ffffff',
        webPreferences: {
            devTools: true
        },
        autoHideMenuBar: true,
        fullscreenable: false,
        resizable: true
    })

    win.loadURL('file://' + __dirname + '/window.html')

    exports.win;

    win.webContents.on('dom-ready', (e) => {
        e.preventDefault();
        win.webContents.send('domrdy', 'DOM ready event fired');
    })

    win.on('closed', () => {
        win = null
    })

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', (event, msg) => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})