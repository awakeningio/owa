import {configureStore, configureLinkStore} from "./configureStore"

import OWAController from "./OWAController"
import AbletonLinkController from "./AbletonLinkController"

var owaStateStore = configureStore();
// TODO: Perhaps separate link into its own state store, since most controllers
// do not need access to those state changes?
//var abletonLinkStateStore = configureLinkStore();

var abletonLinkController = new AbletonLinkController(owaStateStore, {
  stateTreePrefix: 'link'
});

var owaController = new OWAController(owaStateStore);
