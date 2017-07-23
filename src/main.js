import configureStore from "./configureStore"

import OWAController from "./OWAController"

var owaStateStore = configureStore();

var owaController = new OWAController(owaStateStore);
