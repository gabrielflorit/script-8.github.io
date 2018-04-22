const actionTypes = {
  TICK: 'TICK'
}

// const tick = () => ({
//   type: actionTypes.TICK
// })

// const actions = {
//   tick
// }

script8.initialState = {
  ball: {
    x: 64,
    y: 64,
    xDir: 3,
    yDir: -1,
    radius: 4
  },
  paddle: {
    x: 64,
    y: 100,
    width: 36,
    height: 4
  }
}

const bounceOffWalls = ball => {
  const { x, y, radius, xDir, yDir } = ball
  const newXDir = x < radius || x > 127 - radius ? xDir * -1 : xDir
  const newYDir = y < radius || y > 127 - radius ? yDir * -1 : yDir

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
    ball.y >= paddle.y &&
    ball.y <= paddle.y + paddle.height
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

script8.reducer = (state = script8.initialState, action) => {
  log(action)
  switch (action.type) {
    case actionTypes.TICK: {
      const { input } = action
      // Bounce ball off walls.
      let ball = bounceOffWalls(state.ball)

      // Bounce ball off paddle.
      ball = bounceOffPaddle({ ball, paddle: state.paddle })

      // Move ball.
      ball = {
        ...ball,
        x: ball.x + ball.xDir,
        y: ball.y + ball.yDir
      }

      // Move paddle.
      log({ left: input.arrowLeft })
      const { paddle } = state
      const newPaddle = {
        ...paddle,
        x: paddle.x + (input.arrowLeft ? -1 : 0)
      }

      return {
        ...state,
        ball,
        paddle: newPaddle
      }
    }
    default:
      return state
  }
}

// script8.update = () => {
//   script8.store.dispatch(actions.tick())
// }

// I want the ability to, at run-time, select which actor or actors
// to highlight.
// For that, I need to have a list of actors to choose from.
// Then, when paused, I draw everything, plus the non-highlightable actors.
// And then I highlight the actors.

script8.actors = ['paddle', 'ball']

const draw = {
  ball ({ x, y, radius, fade }) {
    circFill(x, y, radius, fade ? 4 : 0)
  },
  paddle ({ x, y, width, height, fade }) {
    rectFill(x, y, width, height, fade ? 5 : 2)
  }
}

script8.drawActors = fade => {
  const { state } = script8
  script8.actors.forEach(actor => {
    draw[actor]({ ...state[actor], fade })
  })
}

script8.draw = () => {
  clear()
  rectFill(0, 0, 128, 128, 6)
  script8.drawActors()
}
