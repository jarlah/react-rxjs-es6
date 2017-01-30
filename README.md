# React-RxJS
#### Documentation

The following documentation describe the two higher order functions provide and inject. 

## provide
provides services objects to all underlying components with the use of react context
- Example: { appSession: { type: React.PropTypes.object, value: appSession$ } }

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
        - Example 2: { someService: { type: React.PropTypes.object.isRequired }
        - Example 3: { someService: { type: React.PropTypes.object.isRequired, mapToProps: (someService) => someService.store$ } }
        - Example 4: { someService: { type: React.PropTypes.object.isRequired, mapToProps: (someService) => { someSpecialStore$: someService.store$ } }
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
