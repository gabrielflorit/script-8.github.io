# SCRIPT-8
A JavaScript-based ([React](https://reactjs.org/) + [Redux](https://redux.js.org/)) fantasy console.

## Setup for local development

### 0 - Clone this repository

`git clone https://github.com/script-8/script-8.github.io.git`

### 1 - Install prerequisites

- [node.js](nodejs.org)
- [yarn](https://yarnpkg.com/en/)
- [stylus](https://www.npmjs.com/package/stylus)

Follow your distro's instructions on how to install node and npm.
To install yarn and stylus, type in a root terminal:
```
npm install yarn stylus -g
```

### 2 - Install dependencies

```
npm install
yarn
```

npm might say that there are some vunerabilities. `macaddress` is not used in a vulnerable way. We're fixing the `base64url` vulnerability, but don't worry - it shouldn't affect anything on your side, except if you're hosting SCRIPT-8 on GitHub Pages.

### 3 - Start a development server
Open up 2 terminals.
In the first one, type:

```
yarn iframe-start
```

**Wait** until it says `Compiled successfully!`. Then, in the second terminal, type:

```
yarn start
````

This will open SCRIPT-8 on `http://localhost:3000`.
You can also try it on another device connected to the same network, by using the address shown in the terminal (`On Your Network`)

## Other information

SCRIPT-8 was built with [create-react-app](https://github.com/facebook/create-react-app). Consult its guide for more instructions (e.g. running tests, building).

## Contributors

- [Gabriel Florit](https://github.com/gabrielflorit)
- [matimati433](https://github.com/matimati433)
