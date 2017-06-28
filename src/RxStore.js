import Rx from 'rxjs';
import deepFreeze from 'deep-freeze';

export function createAction(name) {
  return new Rx.Subject().do(withNodeEnv(maybeLogAction(name)));
}

export function createActions(...actionNames) {
  return actionNames.reduce((akk, name) => ({...akk, [name]: createAction(name)}), {});
}

export function createStore(name, reducer$, initialState$ = Rx.Observable.of({}), keepAlive = false) {
  const store = initialState$
    .merge(reducer$)
    .scan((state, reducer) => {
      if (Array.isArray(reducer)) {
        const [scope, reducerFn] = reducer;
        return {...state, [scope]: reducerFn(state[scope])};
      }
      return reducer(state);
    })
    .do(withNodeEnv(maybeLogState(name)))
    .publishReplay(1)
    .refCount();
  if (keepAlive) {
    store.subscribe(() => {
    });
  }
  return store;
}

const withNodeEnv = (fn) => fn(process.env.NODE_ENV);

const maybeLogAction = name => nodeEnv => action => {
  if (nodeEnv === 'development') {
    console.log(name, action);
  }
};

const maybeLogState = name => nodeEnv => state => {
  if (nodeEnv === 'development') {
    if (state && !Array.isArray(state)) {
      deepFreeze(state);
    }
    // eslint-disable-next-line no-console
    console.debug(name, state);
  }
};
