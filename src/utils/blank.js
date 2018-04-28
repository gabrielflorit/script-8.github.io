export default `script8.initialState = {
  actors: [
    {
      type: 'paddle',
      name: 'paddle',
      x: 64,
      y: 120,
    }
  ]
}

const aesthetics = {
  paddle: {
    width: 36,
    height: 4,
    color: 2
  }
}

const draw = {
  paddle ({ x, y, width, height, color, fade }) {
    rectFill(x, y, width, height, fade ? color + 2 : color)
  }
}

script8.drawActors = (state, fade) => {
  state.actors.forEach(actor => {
    draw[actor.type]({ ...actor, fade, ...aesthetics[actor.type] })
  })
}

const movePaddle = (state, input) => {
  state.actors.filter(d => d.name === 'paddle')
    .forEach(paddle => {
      paddle.x += input.right ? 1 : input.left ? -1 : 0
    })
}

script8.update = (state, input) => {
  movePaddle(state, input)
}

script8.draw = state => {

  clear()
  rectFill(0, 0, 128, 128, 6)
  print(0, 0, 'hello script-8', 0)
  script8.drawActors(state)

}`
