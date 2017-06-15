import React from 'react';
import PropTypes from 'prop-types';

const getDevToolsExt = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return window.__REDUX_DEVTOOLS_EXTENSION__ && window.devToolsExtension;
  }
};

export default class RxContainer extends React.Component {

  static propTypes = {
    component: PropTypes.func,
    observable: PropTypes.object,
    injectedProps: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired
  };

  componentWillMount() {
    const devToolsExt = getDevToolsExt();
    if (devToolsExt) {
      this.devTools = devToolsExt.connect();
      this.unsubscribe = this.devTools.subscribe((message) => {
        if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')) {
          const props = JSON.parse(message.state);
          this.setState({ props });
        }
      });
    }
  }

  componentDidMount() {
    this.subscription = this.props.observable.subscribe(props => {
      if (this.devTools) {
        this.devTools.send('update', props);
      }
      this.setState({ props });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.observable !== this.props.observable) {
      this.subscription.unsubscribe();
      this.setState({props: nextProps.initialState});
      this.subscription = nextProps.observable.subscribe(props => {
        if (this.devTools) {
          this.devTools.send('update', props);
        }
        this.setState({ props });
      });
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
    const devToolsExt = getDevToolsExt();
    if (devToolsExt) {
      this.unsubscribe();
      devToolsExt.disconnect();
    }
  }

  render() {
    if (!this.state) {
      return null;
    }
    const upstreamProps = { ...this.props, ...this.state.props };
    const customProps = typeof this.props.injectedProps === 'function'
      ? this.props.injectedProps(upstreamProps)
      : {
        ...upstreamProps,
        ...this.props.injectedProps
      };
    const Component = this.props.component;
    return (
      <Component
        {...this.props}
        {...this.state.props}
        {...customProps}
      />
    );
  }
}