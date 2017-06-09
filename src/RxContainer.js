import React from 'react';
import PropTypes from 'prop-types';

export default class RxContainer extends React.Component {

  static propTypes = {
    component: PropTypes.func,
    observable: PropTypes.object,
    initialState: PropTypes.object,
    props: PropTypes.object,
    callbacks: PropTypes.object
  };

  componentDidMount() {
    this.subscription = this.props.observable.subscribe(props => {
      this.setState({props});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.observable !== this.props.observable) {
      this.subscription.unsubscribe();
      this.setState({props: nextProps.initialState});
      this.subscription = nextProps.observable.subscribe(props => {
        this.setState({props});
      });
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
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