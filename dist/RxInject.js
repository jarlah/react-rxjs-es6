'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rxjs = require('rxjs');

var _RxContainer = require('./RxContainer');

var _RxContainer2 = _interopRequireDefault(_RxContainer);

var _object = require('object.entries');

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function combineLatestObj(obj) {
  var sources = [];
  var keys = [];
  // eslint-disable-next-line no-restricted-syntax
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys.push(key.replace(/\$$/, ''));
      sources.push(obj[key]);
    }
  }
  return _rxjs.Observable.combineLatest(sources, function () {
    var combination = {};
    for (var i = arguments.length - 1; i >= 0; i -= 1) {
      combination[keys[i]] = arguments.length <= i ? undefined : arguments[i];
    }
    return combination;
  });
}

exports.default = function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var commands = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (Component) {
    var callbacks = (0, _object2.default)(commands).reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          observer = _ref2[1];

      acc[key.replace(/\$$/, '')] = function (value) {
        return observer.next(value);
      };
      return acc;
    }, {});

    var contextTypes = (0, _object2.default)(Object.extend({}, data)).reduce(function (acc, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          k = _ref4[0],
          v = _ref4[1];

      if (v.type) {
        acc[k] = v.type;
      }
      return acc;
    }, {});

    var Injected = function (_React$Component) {
      _inherits(Injected, _React$Component);

      function Injected(p, c) {
        _classCallCheck(this, Injected);

        var _this = _possibleConstructorReturn(this, (Injected.__proto__ || Object.getPrototypeOf(Injected)).call(this, p, c));

        var observablesFromValue = (0, _object2.default)(data).reduce(function (acc, _ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              k = _ref6[0],
              v = _ref6[1];

          if (v.subscribe) {
            acc[k] = v;
          }
          return acc;
        }, {});

        var observablesFromContext = (0, _object2.default)(data).reduce(function (acc, _ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              k = _ref8[0],
              v = _ref8[1];

          var contextVal = _this.context[k];
          if (v.type && contextVal) {
            if (v.mapToProps) {
              return Object.extend({}, acc, v.mapToProps(contextVal));
            }
            return Object.extend({}, acc, _defineProperty({}, k, contextVal));
          }
          return acc;
        }, {});

        var allObservables = Object.extend({}, observablesFromValue, observablesFromContext);

        _this.propsObservable = Object.keys(allObservables).length === 0 ? _rxjs.Observable.of([{}]) : combineLatestObj(allObservables).share();
        return _this;
      }

      _createClass(Injected, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(_RxContainer2.default, {
            props: Object.extend({}, this.props, props),
            callbacks: callbacks,
            component: Component,
            observable: this.propsObservable
          });
        }
      }]);

      return Injected;
    }(_react2.default.Component);

    Injected.contextTypes = contextTypes;

    return function () {
      return _react2.default.createElement(Injected, null);
    };
  };
};