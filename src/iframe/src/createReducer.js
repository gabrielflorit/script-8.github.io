const createReducer = logger => {
  const reducer = (state = {}, action) => {
    switch (action.type) {
      case 'INIT': {
        let newState
        try {
          // This approach mutates state.
          newState = JSON.parse(JSON.stringify(state))
          window.init(newState)

          // This approach does not mutate state.
          // newState = window.init() || {}

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
          // This approach mutates state.
          newState = JSON.parse(JSON.stringify(state))
          window.update(newState, action.input, action.elapsed)

          // This approach does not mutate state.
          // newState = window.update(state, action.input, action.elapsed) || {}

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
