export default `script8.initialState = {
  actors: [
  ]
}

const draw = {
}

script8.drawActors = (state, fade) => {
  state.actors.forEach(actor => {
    draw[actor.type]({ ...actor, fade })
  })
}

script8.update = (state, input) => {
}

script8.draw = state => {
  clear()
}`
