// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import {ipcRenderer} from 'electron'
import $ from 'jquery'

// In renderer process (web page).
ipcRenderer.on('dispatch', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('dispatch', 'ping')

// when a beat button is pressed
$('rect.cls-1').on('click', (e) => {
  var buttonIDParser = new RegExp(/beat-(\d+)_(\d+)/);
  var buttonIDParsed = buttonIDParser.exec(e.currentTarget.id);
  console.log("buttonIDParsed");
  console.log(buttonIDParsed);
  var buttonEvent = {
    type: 'BUTTON_PRESSED',
    level: Number(buttonIDParsed[1]),
    position: Number(buttonIDParsed[2])
  };
  console.log("buttonEvent");
  console.log(buttonEvent);
  ipcRenderer.send('dispatch', buttonEvent);
});
