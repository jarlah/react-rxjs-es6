'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function createActions() {
  for (var _len = arguments.length, actionNames = Array(_len), _key = 0; _key < _len; _key++) {
    actionNames[_key] = arguments[_key];
  }

  return actionNames.reduce(function (akk, name) {
    return _extends({}, akk, _defineProperty({}, name, createAction(name)));
  }, {});
}

function createStore(name, reducer$) {
  var initialState$ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _rxjs2.default.Observable.of({});
  var keepAlive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var store = initialState$.merge(reducer$).scan(function (state, reducer) {
    if (Array.isArray(reducer)) {
      var _reducer = _slicedToArray(reducer, 2),
          scope = _reducer[0],
          reducerFn = _reducer[1];

      return _extends({}, state, _defineProperty({}, scope, reducerFn(state[scope])));
    }
    return reducer(state);
  }).do(withNodeEnv(maybeLogState(name))).publishReplay(1).refCount();
  if (keepAlive) {
    store.subscribe(function () {});
  }
  return store;
}

var withNodeEnv = function withNodeEnv(fn) {
  return fn(process.env.NODE_ENV);
};

var maybeLogAction = function maybeLogAction(name) {
  return function (nodeEnv) {
    return function (action) {
      if (nodeEnv === 'development') {
        console.log(name, action);
      }
    };
  };
};

var maybeLogState = function maybeLogState(name) {
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
};