(
  setState: {
    arg reply, state;
    var owa = OWAController.getInstance();
    var store = owa.owaStore;
    "owa.api.setState".postln();
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
