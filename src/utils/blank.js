export default `
script8.initialState = {
  actors: [
    {
      type: 'ball',
      name: 'ball',
      x: 64,
      y: 64,
      xDir: 3,
      yDir: -1,
    },
    {
      type: 'paddle',
      name: 'paddle',
      x: 64,
      y: 120,
    }
  ]
}

const aesthetics = {
  ball: {
    radius: 4,
    color: 0
  },
  paddle: {
    width: 36,
    height: 4,
    color: 2
  }
}

const draw = {
  ball ({ x, y, radius, color, fade }) {
    circFill(x, y, radius, fade ? color + 2 : color)
  },
  paddle ({ x, y, width, height, color, fade }) {
    rectFill(x, y, width, height, fade ? color + 2 : color)
  }
}

script8.drawActors = (state, fade) => {
  state.actors.forEach(actor => {
    draw[actor.type]({ ...actor, fade })
  })
}

const bounceOffWalls = state => {
  state.actors.filter(d => d.type === 'ball').forEach(ball => {
    const { x, y, radius } = ball
    ball.xDir *= x < radius || x > 127 - radius ? -1 : 1
    ball.yDir *= y < radius || y > 127 - radius ? -1 : 1
  })
}

const movePaddle = (state, input) => {
  state.actors.filter(d => d.type === 'paddle')
    .forEach(paddle => {
      paddle.x += input.right ? 1 : input.left ? -1 : 0
    })
}

const moveBall = state => {
  state.actors.filter(d => d.type === 'ball').forEach(ball => {
    ball.x += ball.xDir
    ball.y += ball.yDir
  })
}

script8.update = (state, input) => {
  state.actors.forEach(actor => {
    const props = aesthetics[actor.type]
    Object.keys(props).forEach(key => {
      actor[key] = props[key]
    })
  })

  movePaddle(state, input)
  bounceOffWalls(state)
  moveBall(state)
}

script8.draw = state => {

  clear()
  rectFill(0, 0, 128, 128, 6)
  print(0, 0, 'hello script-8', 0)
  script8.drawActors(state)

}`
