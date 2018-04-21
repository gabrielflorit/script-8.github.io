const actionTypes = {
  TICK: 'TICK'
}

const tick = () => ({
  type: actionTypes.TICK
})

const actions = {
  tick
}

const initialState = {
  ball: {
    x: 64,
    y: 64,
    xDir: 2,
    yDir: -1,
    radius: 4
  },
  paddle: {
    x: 64,
    y: 100,
    width: 24,
    height: 4
  }
}

const bounceOffWalls = ball => {
  const { x, y, radius, xDir, yDir } = ball
  const newXDir = x < radius || x > 128 - radius ? xDir * -1 : xDir
  const newYDir = y < radius || y > 128 - radius ? yDir * -1 : yDir

  return {
    ...ball,
    xDir: newXDir,
    yDir: newYDir
  }
}

const bounceOffPaddle = ({ ball, paddle }) => {
  let result
  if (
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.y > paddle.y - paddle.height
  ) {
    result = {
      ...ball,
      yDir: ball.yDir * -1
    }
  } else {
    result = {
      ...ball
    }
  }
  return result
}

const draw = {
  ball ({ x, y, radius }) {
    circFill(x, y, radius, 0)
  },
  paddle ({ x, y, width, height }) {
    rectFill(x, y, width, height, 3)
  }
}

script8.reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TICK: {
      // Bounce ball off walls.
      let ball = bounceOffWalls(state.ball)

      // Bounce ball off paddle.
      ball = bounceOffPaddle({ ball, paddle: state.paddle })

      // Move.
      ball = {
        ...ball,
        x: ball.x + ball.xDir,
        y: ball.y + ball.yDir
      }

      return {
        ...state,
        ball
      }
    }
    default:
      return state
  }
}

script8.update = () => {
  script8.store.dispatch(actions.tick())
}

script8.draw = () => {
  clear()
  rectStroke(0, 0, 128, 128, 6)
  const state = script8.store.getState()
  draw.ball(state.ball)
  draw.paddle(state.paddle)
}
