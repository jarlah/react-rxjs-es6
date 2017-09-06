// @flow
import Rx, { Observable, Subject } from 'rxjs';
import deepFreeze from 'deep-freeze';

export function createAction<T>(name: string): Subject<T> {
  return new Rx.Subject().do(withNodeEnv(maybeLogAction(name)));
}

/**
 * @deprecated
 * @param actionNames
 * @returns {*}
 */
export function createActions(...actionNames: Array<string>): { [string]: Subject<void> } {
  return actionNames.reduce((akk, name) => ({...akk, [name]: createAction(name)}), {});
}

export function createStore<T>(
  name: string,
  reducer$: Observable<(T) => T>,
  initialState: Observable<T>,
  keepAlive: boolean = false
): Observable<T> {
  const store = Observable.of(initialState)
    .merge(reducer$)
    .scan((state, reducer) => reducer(state))
    .do(withNodeEnv(maybeLogState(name)))
    .publishReplay(1)
    .refCount();
  if (keepAlive) {
    store.subscribe(() => {
    });
  }
  return store;
}

function withNodeEnv<T>(fn: (env: ?string) => T) {
  return fn(process.env.NODE_ENV);
}

function maybeLogAction<A>(name: string) {
  return (nodeEnv: ?string) => (action: A) => {
    if (nodeEnv === 'development') {
      console.log(name, action);
    }
  };
}

function maybeLogState<T>(name: string) {
  return (nodeEnv: ?string) => (state: T) => {
    if (nodeEnv === 'development') {
      if (state && !Array.isArray(state)) {
        deepFreeze(state);
      }
      // eslint-disable-next-line no-console
      console.debug(name, state);
    }
  };
}
