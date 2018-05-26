/**
 *  @file       InputController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2015 Colin Sullivan
 *  @license    Licensed under the MIT license.
 **/

import SerialPort from "serialport"
import ReadLineParser from '@serialport/parser-readline'

import ControllerWithStore from './ControllerWithStore'
import { buttonPressed } from './actions'
import { getEnvOrError } from './utils'
import { BUTTON_ID_TO_LEVEL_SEGMENT } from './constants'

const DEBUG_INPUT = process.env.DEBUG_INPUT || false;

const INPUT_TYPES = {
  "BUTTON": "B"
};

/**
 *  @class        InputController
 *
 *  @classdesc    Takes input from knobs, connected to the Arduino with a
 *  serial connection over USB.  Translates input messages to state changes.
 *  Arduino is running this script: `arduino/owa_arduino/owa_arduino.ino`.
 **/

class SerialInputController extends ControllerWithStore {
  init () {
    // set up serial port connection to Arduino
    this.arduinoPort = new SerialPort(
      getEnvOrError("INPUT_ARDUINO_SERIALPORT"),
      () => {
        console.log("Port opened!");
      }
    );
    this.parser = new ReadLineParser();
    this.arduinoPort.pipe(this.parser);

    if (DEBUG_INPUT) {
      this.parser.on("data", (data) => {
        console.log(`${new Date()} : ${data}`);
      });
    } else {
      this.parser.on("data", (data) => this.handleIncomingData(data));
    }

  }

  handleButtonMessage (data) {
    var buttonId = data.slice(1) + "";
    this.store.dispatch(
      buttonPressed(
        ...BUTTON_ID_TO_LEVEL_SEGMENT[buttonId]
      )
    );
  }

  handleIncomingData (data) {
    var inputType = data[0];
    //console.log("handleIncomingData");
    //console.log("data");
    //console.log(data);
    switch (inputType) {
      case INPUT_TYPES.BUTTON:
        this.handleButtonMessage(data);
        break;

      default:
        console.warn(`Don't know how to handle input type '${inputType}'.  Ignoring message.`);
    }

  }
}
export default SerialInputController;
