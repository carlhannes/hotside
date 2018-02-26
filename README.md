# hotside
Hot sideloading of javascript code in a browser without serving any files

`hotside` lets you hotload inside another environment, without hijacking your ordinary web host. It gets you a fast hook that watches over the `node_modules` folder and lets you hot-load yourself.

For example: You're building a plugin for an existing environment that does not support hot module replacement, and reloading the entire environment is taking a lot of time, you would rather just reload the specific component you're working on.

## Usage
Navigate to your root directory and use `npm i hotside && npx hotside`
You're now running the hotside service and will see something like `Started on port 16567`

In your code, you can use hotside like this to get a hook with a new instance of a component each time it updates:

```js
import myComponentFactory from 'my-component';
import hot from 'hotside';

let mycomponent = myComponentFactory();

hot('node_modules/my-component/dist/comp.js', (newComponentFactory) => {
    mycomponent = newComponentFactory();
});
```

## Drawdowns
* Currently only watches `node_modules` folder, but it's made for linking packages.

## TODO
* Fix tests. Currently, there are none.
* Rather than watching the whole node_modules tree, watch specific files on subscribe instead. This wouldn't even break the API currently, but I'm just too lazy to rewrite it.
* Sourcemap support? Inline loading of non-inline sourcemaps? 