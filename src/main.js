import {configureStore, configureLinkStore} from "./configureStore"

import OWAController from "./OWAController"
import AbletonLinkController from "./AbletonLinkController"

var owaStateStore = configureStore();
var abletonLinkStateStore = configureLinkStore();

var abletonLinkController = new AbletonLinkController(abletonLinkStateStore, {
  stateTreePrefix: 'abletonlink'
});

var owaController = new OWAController(owaStateStore, {
  linkStateStore: abletonLinkStateStore
});
