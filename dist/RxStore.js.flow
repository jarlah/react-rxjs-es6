// @flow
import { Observable, Subject } from 'rxjs';

export default function createStore<T>(
  name: string,
  reducer$: Observable<(T) => T>,
  initialState: T,
  keepAlive: boolean = false
): Observable<T> {
  const store = reducer$
    .scan((state, reducer) => reducer(state), initialState)
    .do((state: T) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(name, state);
      }
    })
    .publishReplay(1)
    .refCount()
    .startWith(initialState);
  if (keepAlive) {
    store.subscribe(() => {
    });
  }
  return store;
}
