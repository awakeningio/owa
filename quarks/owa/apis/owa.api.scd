(
  init: {
    arg reply, params;
    var owa = OWAController.getInstance();
    owa.init(params);
    reply.value();
  },
  setState: {
    arg reply, state;
    var owa = OWAController.getInstance();
    var store = owa.owaStore;
    store.setState(state);
    reply.value();
  },
  setLinkState: {
    arg reply, state;
    var owa = OWAController.getInstance();
    var store = owa.linkStore;
    store.setState(state);
    reply.value();
  }
);
