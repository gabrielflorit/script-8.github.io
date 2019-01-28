export default `initialState = {
}

update = (state, input, elapsed) => {
}

drawActors = (state, fade) =>
  state.actors && state.actors.forEach(actor =>
    sprite(actor.x, actor.y, actor.sprite, fade ? actor.trailBrighten || -3 : 0, actor.flip)
  )

draw = state => {
  camera()
  clear()
}`
