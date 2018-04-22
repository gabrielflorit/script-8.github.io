const modes = {
  start: 'start',
  play: 'play',
  over: 'over'
}

script8.initialState = {
  ball: {
    x: 64,
    y: 64,
    xDir: 3,
    yDir: -2,
    radius: 4
  },
  paddle: {
    x: 64,
    y: 120,
    width: 36,
    height: 4
  },
  score: 0,
  lives: 3,
  mode: modes.start
}

const bounceOffWalls = ({ state }) => {
  const { ball } = state
  const { x, y, radius, xDir, yDir } = ball
  const newXDir = x < radius || x > 127 - radius ? xDir * -1 : xDir
  const newYDir = y < radius ? yDir * -1 : yDir
  return {
    ...state,
    ball: {
      ...ball,
      xDir: newXDir,
      yDir: newYDir
    }
  }
}

const loseDeadBall = ({ state }) => {
  const { ball, lives, mode } = state
  let newX = ball.x
  let newY = ball.y
  let newYDir = ball.yDir
  let newLives = lives
  let newMode = mode
  if (ball.y > 128 - ball.radius) {
    newX = script8.initialState.ball.x
    newY = script8.initialState.ball.y
    newYDir = script8.initialState.ball.yDir
    newLives -= 1
    if (newLives < 1) {
      newMode = modes.over
    }
  }
  return {
    ...state,
    ball: {
      ...ball,
      x: newX,
      y: newY,
      yDir: newYDir
    },
    lives: newLives,
    mode: newMode
  }
}

const bounceOffPaddle = ({ state }) => {
  const { ball, paddle, score } = state
  let newYDir = ball.yDir
  let newScore = score
  if (
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.y >= paddle.y - paddle.height &&
    ball.y <= paddle.y
  ) {
    newYDir = -Math.abs(newYDir)
    newScore++
  }
  return {
    ...state,
    ball: {
      ...ball,
      yDir: newYDir
    },
    score: newScore
  }
}

const movePaddle = ({ state, input }) => ({
  ...state,
  paddle: {
    ...state.paddle,
    x: state.paddle.x + (input.left ? -3 : input.right ? 3 : 0)
  }
})

const moveBall = ({ state }) => ({
  ...state,
  ball: {
    ...state.ball,
    x: state.ball.x + state.ball.xDir,
    y: state.ball.y + state.ball.yDir
  }
})

script8.updateState = (state, input) => {
  let newState = { ...state }

  switch (newState.mode) {
    case modes.start: {
      if (input.start) {
        newState = {
          ...newState,
          mode: modes.play
        }
      }
      break
    }
    case modes.play: {
      // Move paddle.
      newState = movePaddle({ state: newState, input })

      // Bounce ball off walls.
      newState = bounceOffWalls({ state: newState })

      // Bounce ball off paddle.
      newState = bounceOffPaddle({ state: newState })

      // Move ball.
      newState = moveBall({ state: newState })

      // Lose dead ball.
      newState = loseDeadBall({ state: newState })
      break
    }
    case modes.over: {
      if (input.start) {
        newState = {
          ...newState,
          mode: modes.play,
          score: 0,
          lives: script8.initialState.lives
        }
      }
      break
    }
  }

  return newState
}

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
  const { score, lives, mode } = script8.state
  switch (mode) {
    case modes.start: {
      print(7, 34, 'this is a paddle-and-ball game', 2)
      print(27, 54, 'press enter to play', 0)
      print(5, 74, 'move the paddle with arrow keys', 2)
      break
    }
    case modes.play: {
      print(8, 8, score, 0)
      range(lives).forEach(i => {
        circStroke(100 + i * 8, 10, 3, 3)
      })
      script8.drawActors()
      break
    }
    case modes.over: {
      print(47, 34, 'game over', 0)
      print(47, 44, `score  ${score}`, 2)
      print(17, 64, 'press enter to play again', 1)
      break
    }
  }
}
