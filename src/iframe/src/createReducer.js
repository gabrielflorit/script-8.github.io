const createReducer = logger => {
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
              // Find actors with no id.
              const namelessActors = newState.actors.filter(actor => !actor.id)
              if (namelessActors.length) {
                throw new Error('Actors must have an id property.')
              }
            }
            logger({ type: 'reducerError' })
          } catch (error) {
            logger({ type: 'reducerError', error })
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
