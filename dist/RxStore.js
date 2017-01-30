'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createAction = createAction;
exports.createActions = createActions;
exports.createStore = createStore;

var _rxjs = require('rxjs');

var _rxjs2 = _interopRequireDefault(_rxjs);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createAction() {
  return new _rxjs2.default.Subject();
}

function createActions() {
  for (var _len = arguments.length, actionNames = Array(_len), _key = 0; _key < _len; _key++) {
    actionNames[_key] = arguments[_key];
  }

  return actionNames.reduce(function (akk, name) {
    return Object.extend({}, akk, _defineProperty({}, name, createAction()));
  }, {});
}

function createStore(name, reducer$) {
  var initialState$ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _rxjs2.default.Observable.of({});

  return initialState$.merge(reducer$).scan(function (state, reducer) {
    if (Array.isArray(reducer)) {
      var _reducer = _slicedToArray(reducer, 2),
          scope = _reducer[0],
          reducerFn = _reducer[1];

      return Object.extend({}, state, _defineProperty({}, scope, reducerFn(state[scope])));
    }
    return Object.extend({}, state, reducer(state));
  }).do(function (state) {
    if (_config2.default.isDev) {
      (0, _deepFreeze2.default)(state);
      // eslint-disable-next-line no-console
      console.debug(name, state);
    }
  }).publishReplay(1).refCount();
}