import Rx from 'rxjs';
import deepFreeze from 'deep-freeze';

const maybeLogAction = name => action => {
  if (process.env.NODE_ENV === 'development') {
    console.log(name, action);
  }
};

export function createAction(name) {
  return new Rx.Subject().do(maybeLogAction(name));
}

export function createActions(...actionNames) {
  return actionNames.reduce((akk, name) => ({...akk, [name]: createAction(name)}), {});
}

export function createStore(name, reducer$, initialState$ = Rx.Observable.of({})) {
  return initialState$
    .merge(reducer$)
    .scan((state, reducer) => {
      if (Array.isArray(reducer)) {
        const [scope, reducerFn] = reducer;
        return {...state, [scope]: reducerFn(state[scope])};
      }
      return reducer(state);
    })
    .do((state) => {
      if (process.env.NODE_ENV === 'development') {
        if (state && !Array.isArray(state)) {
          deepFreeze(state);
        }
        // eslint-disable-next-line no-console
        console.debug(name, state);
      }
    })
    .publishReplay(1)
    .refCount();
}