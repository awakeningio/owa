import {configureStore, configureLinkStore} from "./configureStore"

import OWAController from "./OWAController"

var owaStateStore = configureStore();
var abletonLinkStateStore = configureLinkStore();

var owaController = new OWAController(owaStateStore, {
  linkStateStore: abletonLinkStateStore
});
