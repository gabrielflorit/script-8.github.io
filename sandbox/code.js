const actionTypes = {
  TICK: 'TICK'
}

const tick = () => ({
  type: actionTypes.TICK
})

const actions = {
  tick
}

const ball = (state = { x: 0 }, action) => {
  switch (action.type) {
    case actionTypes.TICK:
      return {
        ...state,
        x: state.x + 1
      }
    default:
      return state
  }
}

script8.reducers = {
  ball
}

script8.update = () => {
  script8.store.dispatch(actions.tick())
}

script8.draw = () => {
  log(script8.store.getState().ball.x)
}
