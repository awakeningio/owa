/**
 *  @file       owa.api.scd
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

(
  init: {
    arg reply, params;
    var owa, store, linkStore;
    owa = OWAController.getInstance();
    owa.store.setState(params.state);
    //owa.linkStore.setState(params.linkState);
    owa.init(params);
    reply.value();
  },
  setState: {
    arg reply, state;
    var owa = OWAController.getInstance();
    var store = owa.store;
    //postln("owa.api.setState");
    store.setState(state);
    reply.value();
  },
  //setLinkState: {
    //arg reply, state;
    //var owa = OWAController.getInstance();
    //var store = owa.linkStore;
    ////postln("owa.api.setLinkState");
    //store.setState(state);
    //reply.value();
  //}
);
