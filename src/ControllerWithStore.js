/**
 *  @file       ControllerWithStore.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

class ControllerWithStore {
  constructor(store, params) {
    this.store = store;
    this.params = params || null;

    this.init();

    this.store.subscribe(() => {
      this.handle_state_change();
    });
  }

  init () {
    
  }

  handle_state_change () {
    
  }
}

export default ControllerWithStore;
