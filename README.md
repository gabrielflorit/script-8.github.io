# SCRIPT-8
A JavaScript-based ([React](https://reactjs.org/) + [Redux](https://redux.js.org/)) fantasy console.

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

## Other information

SCRIPT-8 was built with [create-react-app](https://github.com/facebook/create-react-app). Consult its guide for more instructions (e.g. running tests, building).

## Contributors

- [Gabriel Florit](https://github.com/gabrielflorit)
- [Benjamin Philippe Applegate](https://github.com/Camto)
- [matimati433](https://github.com/matimati433)

## TODO
- I need to move from Google Cloud. What needs doing?
- First, let's take an inventory of network requests.
- REACT_APP_AUTHENTICATOR (https://script-8.herokuapp.com) DONE
  - used to authenticate user (fetch and store oauth token)

- REACT_APP_NOW (https://script-8.appspot.com)

  - /id DONE
    - fetch gist if user is not authenticated (no user token)
      - use non-oauth github to request
      - if rate-limit exceeded, then use a now.sh service

  - /cassettes
    - request cassettes for SHELF

  - /unshelve
    - remove cassette from SHELF

  - /cassette
    - put cassette on SHELF
