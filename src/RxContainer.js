import React from 'react';

const getDevToolsExt = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return window.__REDUX_DEVTOOLS_EXTENSION__ && window.devToolsExtension;
  }
};

export default class RxContainer extends React.Component {

  static propTypes = {
    component: React.PropTypes.func,
    observable: React.PropTypes.object,
    initialState: React.PropTypes.object,
    props: React.PropTypes.object,
    callbacks: React.PropTypes.object
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
    const Component = this.props.component;
    return (
      <Component
        {...this.props.props}
        {...this.props.callbacks}
        {...this.state.props}
      />
    );
  }
}