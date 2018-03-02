/**
 *  @file       OSCActionListener.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import osc from 'osc'

import ControllerWithStore from "./ControllerWithStore"

/**
 *  @class        OSCActionListener
 *
 *  @classdesc    Listen for actions on an incoming OSC port and forward
 *  to the state store.
 **/
class OSCActionListener extends ControllerWithStore {
  init () {
    this.oscPort = new osc.UDPPort({
      localAddress: '127.0.0.1',
      localPort: this.params.localPort,
      remoteAddress: '127.0.0.1',
      remotePort: this.params.remotePort
    });
    this.oscPort.on("message", (msg) => {
      //console.log("msg");
      //console.log(msg);
      
      // expecting actions to have a `type` and an optional `payload`, key
      // value pairs sent in as a single OSC array.  If the keyword `payload`
      // appears, it implies we start filling the payload with subsequent
      // key value pairs

      let parsingPayload = false;
      let actionPairs = msg.args;
      let i;
      let action = {
      };
      for (i = 0; i < actionPairs.length - 1; i+=2) {
        if (actionPairs[i] == 'payload') {
          parsingPayload = true
          action.payload = {};
          i += 1;
        }

        if (parsingPayload) {
          action.payload[actionPairs[i]] = actionPairs[i + 1];
        } else {
          action[actionPairs[i]] = actionPairs[i + 1];
        }
      }

      this.store.dispatch(action);

    });
    this.oscPort.open();
  }
  quit () {
    this.oscPort.close();
  }
}

export default OSCActionListener;
