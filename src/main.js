import { createStore, combineReducers } from 'redux'

import owa from './reducers/owa'

console.log("owa");
console.log(owa);

var owaStateStore = createStore(combineReducers({
  owa
}));

console.log("Hello!");

console.log("owaStateStore.getState()");
console.log(owaStateStore.getState());
