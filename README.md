# SCRIPT-8
A JavaScript-based ([React](https://reactjs.org/) + [Redux](https://redux.js.org/)) fantasy console.

## setup
- `npm install`

## run
- `npm start`

## roadmap
Here's a list of things SCRIPT-8 should do:

- livecoding-style coding feedback - see code output as you type, without needing to compile
  - implement bret victor-style "see the future/past"
- 128px by 128px
- 8 colors
- drawing api (can't use canvas directly)
- sfx editor
- instrument editor
- music editor (phrases, chains, etc)
- sprite editor
- save as gists
- use the 'cassette' metaphor as guide
  - "save cassette"
  - sharing your game should feel like you're sharing a cassette
- see other games without much work (maybe in-console?)
- enforce cap on size (maybe 8kb? maybe 16kb? not sure yet)
- limit music/sfx:
  - limited number of channels, sfx banks, instruments
  - make sure we can only create 8-bit-ish sounds
  - enforce limited synth options
 - make sure readers don't "cheat" by writing js that loads in external assets
  - might need to parse code with acorn and only allow specific tokens

## todo
- modify canvas api:
  - don't allow rects like 1xN or Nx1
  - add a diagonal line call

- add sound
  - enable playing sfx in code and run
  - figure out the best oscillator settings etc 
  - maybe save note name instead of number

- saving an empty code screen errors out

- add error screen

- add way to specify frame rate
- when fetching gist, try to do hit github directly by using user's token
- also when fetching default gist, try to avoid hitting github api directly
- add fps counter to iframe (perhaps a stats mode?)
- drop gatekeeper, it's too slow
