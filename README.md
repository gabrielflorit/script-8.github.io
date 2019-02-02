# SCRIPT-8
A JavaScript-based ([React](https://reactjs.org/) + [Redux](https://redux.js.org/)) fantasy computer for making, sharing, and playing tiny retro-looking games.

## Discord channel

There is a dedicated SCRIPT-8 room in the [Fantasy Consoles discord server](https://discord.gg/HA68FNX). Come join us.

## Setup for local development

### 0 - Clone or download this repository

### 1 - Install prerequisites

- [node.js](nodejs.org)
- [yarn](https://yarnpkg.com/en/)

### 2 - Install this repository

```
yarn
```

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

## To deploy

Switch to `dev` branch. Pull latest. Then,

- `yarn run version`
- `yarn run deploy`

## Other information

SCRIPT-8 was built with [create-react-app](https://github.com/facebook/create-react-app). Consult its guide for more instructions (e.g. running tests, building).

## Contributors

- [Gabriel Florit](https://github.com/gabrielflorit)
- [Benjamin Philippe Applegate](https://github.com/Camto)
- [matimati433](https://github.com/matimati433)
- [Grant Herman](https://github.com/grantlouisherman)
