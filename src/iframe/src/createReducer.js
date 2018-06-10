const createReducer = () => {
  // Create the reducer, with the script8 state or an empty object.
  const reducer = (state = window.initialState || {}, action) => {
    switch (action.type) {
      case 'TICK': {
        if (window.update) {
          let newState
          try {
            newState = JSON.parse(JSON.stringify(state))
            window.update(newState, action.input, action.elapsed)
            if (newState.actors) {
              // Find actors with no name.
              const namelessActors = newState.actors.filter(
                actor => !actor.name
              )
              if (namelessActors.length) {
                console.warn('Error: actors must have a name property.')
              }
            }
          } catch (e) {
            console.warn(e.message)
            return state
          }
          return newState
        } else {
          return state
        }
      }
      default:
        return state
    }
  }
  return reducer
}

export default createReducer
