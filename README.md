![SCRIPT-8](https://github.com/script-8/script-8.github.io/raw/dev/public/logo.png)  
SCRIPT-8 is a JavaScript-based ([React](https://reactjs.org/) + [Redux](https://redux.js.org/)) fantasy computer for making, sharing, and playing tiny retro-looking games (called cassettes). It's free, browser-based, and open-source. Cassettes are written in JavaScript.

SCRIPT-8 is designed to encourage play — the kind of wonder-filled play children experience as they explore and learn about the world. In order to support this goal, everything in SCRIPT-8 has immediate feedback. It is what some call a "livecoding" environment.

It features:

- a code editor where the game changes as you type  
![a code editor where the game changes as you type](https://script-8.github.io/static/media/livecoding480.20d1866a.gif)

- a slider to help you tweak numbers without typing  
![a slider to help you tweak numbers without typing](https://script-8.github.io/static/media/slider480.dc4d8c4b.gif)

- a time-traveling tool so you can pause and rewind  
![a time-traveling tool so you can pause and rewind](https://script-8.github.io/static/media/pauserewind.741e69fa.gif)

- buttons that show a character's past and future paths  
![buttons that show a character's past and future paths](https://script-8.github.io/static/media/toggle.4ab6d6b6.gif)

- the ability to combine all the above so you can manipulate time  
[![the ability to combine all the above so you can manipulate time](https://github.com/script-8/script-8.github.io/raw/dev/public/youtubepromo.jpg)](https://www.youtube.com/watch?v=0rg5GGFaIY0)

- a sprite editor where the game instantly displays your edits  
![a sprite editor where the game instantly displays your edits](https://script-8.github.io/static/media/spritedemo.76159464.gif)

- a map editor where changes alter the game's behavior, in real-time  
![a map editor where changes alter the game's behavior, in real-time](https://script-8.github.io/static/media/mapdemo.23680514.gif)

- a music editor where you create phrases, group them into chains, and turn those into songs  
![a music editor where you create phrases, group them into chains, and turn those into songs](https://script-8.github.io/static/media/musicdemo.c1b0f3bd.gif)

Each cassette is recorded to a URL you can share with anyone.

Play cassettes with a keyboard or gamepad.

You can inspect any cassette's contents (even if it's not yours), change the code, art, or music, and record it to a different cassette — a new version.

SCRIPT-8 is heavily influenced by Bret Victor's ideas (specifically [Inventing on principle](http://vimeo.com/36579366) and [Learnable programming](http://worrydream.com/LearnableProgramming/)) and Joseph White's [PICO-8](https://www.lexaloffle.com/pico-8.php) (the best of all fantasy consoles).

If you have any questions, come join us on the [Fantasy Consoles discord server](https://discord.gg/HA68FNX), a friendly place to chat about these sophisticated, cutting-edge computers. The server has a dedicated SCRIPT-8 room.

SCRIPT-8 nyx8 palette by [Javier Guerrero](https://twitter.com/Xavier_Gd). Sprites in Los Hermanos Bros. by [Johan Vinet](https://twitter.com/johanvinet).

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

### Note for windows users 

In some circumstances yarn can complain with something like this error:

```
yarn run v1.13.0
$ npm-run-all -p iframe-start-js iframe-watch-css
$ cd src/iframe; react-scripts start
$ cd src/iframe; stylus src/css/Iframe.styl -o src/css -w
The system cannot find the path specified.
The system cannot find the path specified.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
ERROR: "iframe-start-js" exited with 1.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

A quick fix is to install Git for windows and configure npm to use Git Bash instead of cmd to run package.json scripts.

```
yarn config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```

## To deploy

Switch to `dev` branch. Pull latest. Then,

- `yarn run version`
- `yarn run deploy`

## Other information

SCRIPT-8 was built with [create-react-app](https://github.com/facebook/create-react-app). Consult its guide for more instructions (e.g. running tests, building).
