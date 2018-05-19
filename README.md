# SCRIPT-8
A JavaScript-based ([React](https://reactjs.org/) + [Redux](https://redux.js.org/)) fantasy console.

## Building
To build SCRIPT-8, you must first install [node.js](nodejs.org) with [npm](https://npmjs.com).

### Install required software

```
npm install -g yarn npm-run-all
yarn
```

### Start a development server
Open up 2 terminals.
In the first one, type:

```
yarn start
```

In the second one, type:

```
yarn iframe-start
````

Allow `yarn` to run `iframe-start` on port 3001.
SCRIPT-8 is now on `localhost:3000`.

### Make a production build
```
yarn build
```
