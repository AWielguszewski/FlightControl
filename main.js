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
        height: 600,
        width: 1280,
        backgroundColor: '#262626',
        webPreferences: {
            devTools: true
        },
        autoHideMenuBar: true,
        fullscreenable: false,
        resizable: false
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'starting_page.html'),
        protocol: 'file:',
        slashes: true
    }))

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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})