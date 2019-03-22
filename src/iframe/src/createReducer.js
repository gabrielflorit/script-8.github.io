const createReducer = logger => {
  const reducer = (state = {}, action) => {
    switch (action.type) {
      case 'INIT': {
        let newState
        try {
          newState = window.init ? window.init() || {} : {}
          if (newState.actors) {
            // Find actors with no id.
            const namelessActors = newState.actors.filter(actor => !actor.id)
            if (namelessActors.length) {
              throw new Error('Actors must have an id property.')
            }
          }
          logger({ type: 'reducerError' })
        } catch (error) {
          newState = state
          logger({ type: 'reducerError', error })
        } finally {
          return newState
        }
      }
      case 'UPDATE': {
        let newState
        try {
          newState = window.update
            ? window.update(state, action.input, action.elapsed) || {}
            : {}
          if (newState.actors) {
            // Find actors with no id.
            const namelessActors = newState.actors.filter(actor => !actor.id)
            if (namelessActors.length) {
              throw new Error('Actors must have an id property.')
            }
          }
          logger({ type: 'reducerError' })
        } catch (error) {
          newState = state
          logger({ type: 'reducerError', error })
        } finally {
          return newState
        }
      }
      default:
        return state
    }
  }
  return reducer
}

export default createReducer
