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
    //var owa, store;
    "owa.api.init".postln();
    OWAController.getInstance().init(params);
    //owa.store.setState(params.state);
    //owa.linkStore.setState(params.linkState);
    //owa.init(params);
    reply.value((
      result: "ok"
    ));
  },
  //setState: {
    //arg reply, state;
    //var owa = OWAController.getInstance();
    //var store = owa.store;
    //store.setState(state);
    //reply.value();
  //},
  //setLinkState: {
    //arg reply, state;
    //var owa = OWAController.getInstance();
    //var store = owa.linkStore;
    ////postln("owa.api.setLinkState");
    //store.setState(state);
    //reply.value();
  //}
);
