'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createAction = createAction;
exports.createActions = createActions;
exports.createStore = createStore;

var _rxjs = require('rxjs');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createAction(name) {
  return new _rxjs.Subject().do(function (action) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(name, action);
    }
  });
}

function createActions() {
  for (var _len = arguments.length, actionNames = Array(_len), _key = 0; _key < _len; _key++) {
    actionNames[_key] = arguments[_key];
  }

  return actionNames.reduce(function (akk, name) {
    return _extends({}, akk, _defineProperty({}, name, createAction(name)));
  }, {});
}

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

exports.default = createStore;