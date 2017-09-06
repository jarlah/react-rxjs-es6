// @flow
import React from 'react';
import { Observable, Subscription } from 'rxjs';

export type Injector<ComponentProps, UpstreamProps> = (
  Component: React$ComponentType<ComponentProps>
) => React$ComponentType<UpstreamProps>;

export type PropsType<ComponentProps, StoreProps, UpstreamProps> = (
  store: StoreProps,
  upstream: UpstreamProps
) => ComponentProps | ComponentProps;

type Message = {
  type: string,
  payload: {
    type: string
  },
  state: any
};

type DevToolsInstance = {
  subscribe: (sub: (message: Message) => void) => () => void,
  send: (n: string, o: any) => void
};

type DevTools = {
  connect: () => DevToolsInstance,
  disconnect: () => void
};

export default function inject<ComponentProps, StoreProps, UpstreamProps>(
  store: Observable<StoreProps>,
  props: PropsType<ComponentProps, StoreProps, UpstreamProps>
): Injector<ComponentProps, UpstreamProps> {
  return (Component: React$ComponentType<ComponentProps>) => {
    type State = { store: StoreProps };
    class Inject extends React.Component<UpstreamProps, State> {
      state: State;
      subscription: Subscription;
      unsubscribe: () => void;
      devTools: DevToolsInstance;

      componentWillMount() {
        const devToolsExt = getDevToolsExt();
        if (devToolsExt) {
          this.devTools = devToolsExt.connect();
          this.unsubscribe = this.devTools.subscribe((message) => {
            if (message.type === 'DISPATCH' && (message.payload.type === 'JUMP_TO_ACTION' || message.payload.type === 'JUMP_TO_STATE')) {
              const props: StoreProps = (JSON.parse(message.state): StoreProps);
              this.setState({ store: props });
            }
          });
        }
      }

      componentDidMount() {
        this.subscription = store.subscribe(storeProps => {
          if (this.devTools) {
            this.devTools.send('update', storeProps);
          }
          this.setState({ store: storeProps });
        });
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
        const customProps =
          typeof props === 'function' ? props(this.state.store, this.props) : props;
        return <Component {...(customProps: any)} />;
      }
    }
    return Inject;
  };
}

function getDevToolsExt(): ?DevTools {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    return window.__REDUX_DEVTOOLS_EXTENSION__ && window.devToolsExtension;
  }
}