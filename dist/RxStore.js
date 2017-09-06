'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createAction = createAction;
exports.createActions = createActions;
exports.createStore = createStore;

var _rxjs = require('rxjs');

var _rxjs2 = _interopRequireDefault(_rxjs);

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createAction(name) {
  return new _rxjs2.default.Subject().do(withNodeEnv(maybeLogAction(name)));
}

/**
 * @deprecated
 * @param actionNames
 * @returns {*}
 */
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

  var store = _rxjs.Observable.of(initialState).merge(reducer$).scan(function (state, reducer) {
    return reducer(state);
  }).do(withNodeEnv(maybeLogState(name))).publishReplay(1).refCount();
  if (keepAlive) {
    store.subscribe(function () {});
  }
  return store;
}

function withNodeEnv(fn) {
  return fn(process.env.NODE_ENV);
}

function maybeLogAction(name) {
  return function (nodeEnv) {
    return function (action) {
      if (nodeEnv === 'development') {
        console.log(name, action);
      }
    };
  };
}

function maybeLogState(name) {
  return function (nodeEnv) {
    return function (state) {
      if (nodeEnv === 'development') {
        if (state && !Array.isArray(state)) {
          (0, _deepFreeze2.default)(state);
        }
        // eslint-disable-next-line no-console
        console.debug(name, state);
      }
    };
  };
}