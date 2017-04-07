'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDevToolsExt = function getDevToolsExt() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return window.__REDUX_DEVTOOLS_EXTENSION__ && window.devToolsExtension;
  }
};

var RxContainer = function (_React$Component) {
  _inherits(RxContainer, _React$Component);

  function RxContainer() {
    _classCallCheck(this, RxContainer);

    return _possibleConstructorReturn(this, (RxContainer.__proto__ || Object.getPrototypeOf(RxContainer)).apply(this, arguments));
  }

  _createClass(RxContainer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var devToolsExt = getDevToolsExt();
      if (devToolsExt) {
        this.devTools = devToolsExt.connect();
        this.unsubscribe = this.devTools.subscribe(function (message) {
          if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')) {
            var props = JSON.parse(message.state);
            _this2.setState({ props: props });
          }
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      this.subscription = this.props.observable.subscribe(function (props) {
        if (_this3.devTools) {
          _this3.devTools.send('update', props);
        }
        _this3.setState({ props: props });
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this4 = this;

      if (nextProps.observable !== this.props.observable) {
        this.subscription.unsubscribe();
        this.setState({ props: nextProps.initialState });
        this.subscription = nextProps.observable.subscribe(function (props) {
          if (_this4.devTools) {
            _this4.devTools.send('update', props);
          }
          _this4.setState({ props: props });
        });
      }
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
      var Component = this.props.component;
      return _react2.default.createElement(Component, _extends({}, this.props.props, this.props.callbacks, this.state.props));
    }
  }]);

  return RxContainer;
}(_react2.default.Component);

RxContainer.propTypes = {
  component: _react2.default.PropTypes.func,
  observable: _react2.default.PropTypes.object,
  initialState: _react2.default.PropTypes.object,
  props: _react2.default.PropTypes.object,
  callbacks: _react2.default.PropTypes.object
};
exports.default = RxContainer;