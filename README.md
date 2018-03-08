# script-8

## TODO
- modify canvas api:
  - don't allow rects like 1xN or Nx1
  - add a diagonal line call

- add sound
  - sfx should have its own save
  - notesinputs should not be clickable
    - they should either be an input box, or just a span
  - disable text selection on non-code elements
  - use different colors for volume bars
  - maybe consider using notesinputs for volume too
    - if so, specify a notesinputs formatter

- add way to specify frame rate
- when fetching gist, try to do hit github directly by using user's token
- also when fetching default gist, try to avoid hitting github api directly
- add fps counter to iframe (perhaps a stats mode?)
- drop gatekeeper, it's too slow
