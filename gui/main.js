/**
 *  @file       main.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

//import { app, BrowserWindow, ipcMain } from 'electron';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

//import osc from 'osc';
const osc = require('osc');

/**
 *  Retrieve an environment variable by name, error if it doesn't exist.
 **/
function getEnvOrError(envName) {
  var result = process.env[envName];

  if (result) {
    return result;
  } else {
    throw new Error(`env variable '${envName}' not defined`);
  }
}

const NODE_ENV=getEnvOrError('NODE_ENV');

let mainWindow = null;

let oscPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: getEnvOrError('GUI_OSC_IN_PORT'),
  remoteAddress: getEnvOrError('OWA_HOST'),
  remotePort: getEnvOrError('GUI_OSC_OUT_PORT')
});

oscPort.open();

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 1280, height: 1280});
  if (NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

// when a dispatch message is received from the renderer process
ipcMain.on('dispatchButtonPressed', (event, arg) => {
  let message = {
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
  };
  console.log(`dispatching ${JSON.stringify(message)}...`);
  // forward it to the OWAServer
  oscPort.send(message);
});
