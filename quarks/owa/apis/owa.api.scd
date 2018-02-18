(
  init: {
    arg reply, params;
    var owa, store, linkStore;
    owa = OWAController.getInstance();
    owa.owaStore.setState(params.state);
    owa.linkStore.setState(params.linkState);
    owa.init(params);
    reply.value();
  },
  setState: {
    arg reply, state;
    var owa = OWAController.getInstance();
    var store = owa.owaStore;
    //postln("owa.api.setState");
    store.setState(state);
    reply.value();
  },
  setLinkState: {
    arg reply, state;
    var owa = OWAController.getInstance();
    var store = owa.linkStore;
    //postln("owa.api.setLinkState");
    store.setState(state);
    reply.value();
  }
);
