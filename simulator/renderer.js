// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import {ipcRenderer} from 'electron'
// In renderer process (web page).
ipcRenderer.on('dispatch', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('dispatch', 'ping')
