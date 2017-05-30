'use strict';

var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

var path = require('path');
var url = require('url');

var win = void 0;

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
    });

    win.loadURL(url.format({
        pathname: path.join('..', 'src', 'window.html'),
        protocol: 'file:',
        slashes: true
    }));

    exports.win;

    win.webContents.on('dom-ready', function (e) {
        e.preventDefault();
        win.webContents.send('domrdy', 'DOM ready event fired');
    });

    win.on('closed', function () {
        win = null;
    });

    win.once('ready-to-show', function () {
        win.show();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function (event, msg) {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});