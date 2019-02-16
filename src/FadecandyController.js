/**
 *  @file       FadecandyController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import net from 'net'
import createOPCStream from 'opc'

import {
  FADECANDY_DISCONNECTED,
  FADECANDY_CONNECTED,
  FADECANDY_CONNECTING
} from './actionTypes'

import { getEnvAsNumber } from './utils';

const DISABLE_LIGHTING = getEnvAsNumber('DISABLE_LIGHTING');

/**
 *  @class        FadecandyController
 *
 *  @classdesc    Connect to fadecandy and dispatch the connection events
 *  to a state store.
 **/ class FadecandyController {
  constructor(store) {
    this.store = store;
    // connecting directly to Fadecandy with this socket
    this.socket = new net.Socket();
    this.socket.setNoDelay();
    this.onClose = this.handleSocketClosed.bind(this);
    this.onError = this.handleSocketClosed.bind(this);
    this.onConnect = this.handleSocketConnected.bind(this);
    this.socket.on('close', this.onClose);
    this.socket.on('error', this.onError);
    this.socket.on('connect', this.onConnect);
    
    // We will stream OPC data to the fadecandy over the socket
    this.opcStream = createOPCStream();
    this.opcStream.pipe(this.socket);

    if (!DISABLE_LIGHTING) {
      this.connect();
    }
  }
  handleSocketClosed () {
    this.store.dispatch({
      type: FADECANDY_DISCONNECTED
    });
    this.connect();
  }
  handleSocketConnected () {
    this.store.dispatch({
      type: FADECANDY_CONNECTED
    });
  }
  connect () {
    this.store.dispatch({
      type: FADECANDY_CONNECTING
    });
    this.socket.connect(7890, process.env.FADECANDY_HOST || 'localhost');
  }
  writePixels (pixels) {
    this.opcStream.writePixels(0, pixels.buffer);
  }
  quit () {
    this.socket.off('close', this.onClose);
    this.socket.off('error', this.onError);
    this.socket.off('connect', this.onConnect);
    this.opcStream.unpipe(this.socket);
    this.socket.end();
  }
}

export default FadecandyController;
