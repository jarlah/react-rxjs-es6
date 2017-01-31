# React-RxJS

Documentation

Content:

1. How React+Redux works
2. How React+RxJS works
3. Extended documentation

### 1. How React+Redux works

In react-redux, you will usually have three parts for tracking and updating application state:

1. Action creator(s)
2. Reducer(s)
3. Mapping code on the component

For ex: 

#### 1. actions.js:
```
export const SET_STUFF_ID = 'app/name/space/SET_STUFF_ID';

export const setStuffId = (stuffId: number) => {
  return {
    type: SET_STUFF_ID,
    stuffId
  };
};
```
#### 2. reducer.js:
```
import { SET_STUFF_ID } from './actions.js';

export default (state = {}, action = {}) => {
  switch(action.type) {
    case SET_STUFF_ID:
      return {
        ...state,
        stuffId: action.stuffId
      };
    default:
      return state;
  }
}
```
#### 3. Mapping code on the component:
```
import { setStuffId } from './actions.js';
import { connect } from 'react-redux';

class SomeComponent {}

const mapStateToProps = (state) => ({
  stuffId: state.stuffReducer.stuffId
});

const mapDispatchToProps = ({
  setStuffId
});

export default connect(mapStateToProps, mapDispatchToProps)(SomeComponent);
```

Some developers combine the first two parts, but they are mutual unaware of each other, and should be.

However, there is not guarantee that the switch case matches the action types correctly. It is also easy to make mistakes and mutate the state.

### 2. How React+RxJS works

In this library, we create an RxJS stream in the following way:

stuffStore.js:
```
import { createAction, createStore } from 'react-rxjs/dist/RxStore';

export const setStuffId$ = createAction('setStuffId$');

const reducer$ = setStuffId$.map((stuffId) => (state) => ({...state, stuffId}));

export default createStore('stuffStore', reducer$, Observable.of({ stuffId: null}));
```

We map stuffStore like this:

```
import stuffStore$, { setStuffId$ } from './stuffStore.js';
import inject from 'react-rxjs/dist/RxInject';

const StuffComponent = (props) => (
  <div>
     <h1>StuffId</h1>
     <span>{props.stuffStore.stuffId}</span>
  </div>
);

const data = {
  stuffStore$
};

const commands = {
  setStuffId$
};

export default inject(data, commands)(StuffComponent);
```

### 3. Extended documentation

The following documentation describe the two higher order functions provide and inject. 

## provide
provides services objects to all underlying components with the use of react context
- Example: { someService$: { type: React.PropTypes.object, value: someService$ } }

Usage:

```
import someService$ from '...';

export default provide({
  someService$: {
    type: PropTypes.object,
    value: someService$
  }
})(appRouter);
```

## inject
injects data and commands as props to connected component
- data:
    - An object with values of type Rx.Observables or plain objects, either by value or from context
        - Example 1: { store$ }
        - Example 2: { someService$: { type: React.PropTypes.object.isRequired }
        - Example 3: { someService$: { type: React.PropTypes.object.isRequired, mapToProps: (someService$) => someService$.store$ } }
        - Example 4: { someService$: { type: React.PropTypes.object.isRequired, mapToProps: (someService$) => { someSpecialStore$: someService$.store$ } }
- commands
    - An object with values of type Rx.Subject, e.g. the commands
        - Example 5: { callMe$ }

Usage:

for sub components or pages:
```
import store$ from '...';

const data = {
    // Example 1:
    store$,
    // Example 2:
    someService$: {
      type: React.PropTypes.object.isRequired
    },
    // Example 3:
    someService$: {
      type: React.PropTypes.object.isRequired,
      mapToProps: (someService$) => someService$.store$
    },
    // Example 3:
    someService$: {
      type: React.PropTypes.object.isRequired,
      mapToProps: (someService$) => ({ someSpecialStore$: someService.store$ })
    }
};

const commands = {
    // Example 5:
    callMe$,
    loadStuff$
};
export default inject(data, commands)(SomeComp);
```
