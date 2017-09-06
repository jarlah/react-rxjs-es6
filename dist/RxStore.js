'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;

var _rxjs = require('rxjs');

function createStore(name, reducer$, initialState) {
  var keepAlive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var store = reducer$.scan(function (state, reducer) {
    return reducer(state);
  }, initialState).do(function (state) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(name, state);
    }
  }).publishReplay(1).refCount().startWith(initialState);
  if (keepAlive) {
    store.subscribe(function () {});
  }
  return store;
}