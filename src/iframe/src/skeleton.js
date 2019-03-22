export default `init = () => ({
})

update = (state, input, elapsed) => ({
  ...state,
})

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
