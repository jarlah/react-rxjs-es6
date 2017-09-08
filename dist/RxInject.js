'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = inject;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rxjs = require('rxjs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function inject(store, props) {
  var observable = store instanceof _rxjs.Observable ? store : combineLatest(store);
  return function (Component) {
    var Inject = function (_React$Component) {
      _inherits(Inject, _React$Component);

      function Inject() {
        _classCallCheck(this, Inject);

        return _possibleConstructorReturn(this, (Inject.__proto__ || Object.getPrototypeOf(Inject)).apply(this, arguments));
      }

      _createClass(Inject, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _this2 = this;

          var devToolsExt = getDevToolsExt();
          if (devToolsExt) {
            this.devTools = devToolsExt.connect();
            this.unsubscribe = this.devTools.subscribe(function (message) {
              if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')) {
                var _props = JSON.parse(message.state);
                _this2.setState({ store: _props });
              }
            });
          }
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this3 = this;

          this.subscription = observable.subscribe(function (storeProps) {
            if (_this3.devTools) {
              _this3.devTools.send('update', storeProps);
            }
            _this3.setState({ store: storeProps });
          });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.subscription.unsubscribe();
          var devToolsExt = getDevToolsExt();
          if (devToolsExt) {
            this.unsubscribe();
            devToolsExt.disconnect();
          }
        }
      }, {
        key: 'render',
        value: function render() {
          if (!this.state) {
            return null;
          }
          var customProps = typeof props === 'function' ? props(this.state.store, this.props) : props;
          return _react2.default.createElement(Component, customProps);
        }
      }]);

      return Inject;
    }(_react2.default.Component);

    return Inject;
  };
}

function getDevToolsExt() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return window.__REDUX_DEVTOOLS_EXTENSION__ && window.devToolsExtension;
  }
}

// Fixme this looks like shit
function combineLatest(stores) {
  var storeValues = [];
  var storeKeys = [];
  for (var key in stores) {
    if (Object.prototype.hasOwnProperty.call(stores, key)) {
      storeKeys.push(key.replace(/\$$/, ''));
      storeValues.push(stores[key]);
    }
  }
  // $FlowFixMe spreading is not supported by rxjs flow def
  var data$ = _rxjs.Observable.combineLatest.apply(_rxjs.Observable, storeValues.concat([function () {
    var combination = {};
    for (var i = arguments.length - 1; i >= 0; i -= 1) {
      combination[storeKeys[i]] = arguments.length <= i ? undefined : arguments[i];
    }
    return combination;
  }]));
  data$.subscribe(function () {});
  return data$;
}