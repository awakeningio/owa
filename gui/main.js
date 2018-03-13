/**
 *  @file       main.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { app, BrowserWindow, ipcMain } from 'electron';

import osc from 'osc';

let mainWindow = null;

let oscPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: process.env.SIMULATOR_OSC_IN_PORT,
  remoteAddress: '127.0.0.1',
  remotePort: process.env.SIMULATOR_OSC_OUT_PORT
});

oscPort.open();

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

// when a dispatch message is received from the renderer process
ipcMain.on('dispatchButtonPressed', (event, arg) => {
  // forward it to the OWAServer
  oscPort.send({
    address: '/dispatch',
    args: [
      {
        type: "s",
        value: "type"
      },
      {
        type: "s",
        value: "BUTTON_PRESSED"
      },
      {
        type: "s",
        value: "payload"
      },
      {
        type: "s",
        value: 'levelId'
      },
      {
        type: "s",
        value: `level_${arg.level}`
      },
      {
        type: "s",
        value: 'segmentIndex'
      },
      {
        type: "i",
        value: arg.position
      }
    ]
  });
});