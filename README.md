# script-8

## TODO
- make the websockets thing robust. problems:
  - should not be on during prod
  - should be pointing at any folder on local,
    - so we should add a param, e.g. `node server.js my-folder`
  - the client should not fail if there's no websocket
    - because we won't always be needing it
  - bonus! figure out how to use vim buffer change events
    - and send the entire buffer to client via websocket

- add sound
  - initial sfx state should be {},
    - and we should handle the null bars in notespad
  - sfx should have its own save

- add way to specify frame rate
- when fetching gist, try to do hit github directly by using user's token
- add fps counter to iframe (perhaps a stats mode?)
- drop gatekeeper, it's too slow
