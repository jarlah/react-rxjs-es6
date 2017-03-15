import React from 'react';

const withDevTools = (
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' && window.devToolsExtension
);

export default class RxContainer extends React.Component {

  static propTypes = {
    component: React.PropTypes.func,
    observable: React.PropTypes.object,
    initialState: React.PropTypes.object,
    props: React.PropTypes.object,
    callbacks: React.PropTypes.object
  };

  componentWillMount() {
    if (withDevTools) {
      this.devTools = window.devToolsExtension.connect();
      this.unsubscribe = this.devTools.subscribe((message) => {
        if (message.type === 'DISPATCH' && message.payload.type === 'JUMP_TO_ACTION') {
          const props = JSON.parse(message.state);
          this.setState({ props });
        }
      });
    }
  }

  componentDidMount() {
    this.subscription = this.props.observable.subscribe(props => {
      this.devTools.send('update', props);
      this.setState({ props });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.observable !== this.props.observable) {
      this.subscription.unsubscribe();
      this.setState({props: nextProps.initialState});
      this.subscription = nextProps.observable.subscribe(props => {
        this.devTools.send('update', props);
        this.setState({ props });
      });
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
    if (withDevTools) {
      this.unsubscribe();
      window.devToolsExtension.disconnect();
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