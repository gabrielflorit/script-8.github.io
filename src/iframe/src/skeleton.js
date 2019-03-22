export default `init = () => {
  return {
  }
}

update = (state, input, elapsed) => {
  return state
}

drawActors = (state, fade) =>
  state.actors && state.actors.forEach(actor =>
    sprite(
      actor.x,
      actor.y,
      actor.sprite,
      fade ? actor.trailBrighten || -3 : actor.brighten,
      actor.flipH,
      actor.flipV
    )
  )

draw = state => {
  camera()
  clear()
}`
