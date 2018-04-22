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

const bounceOffWalls = state => {
  const { ball } = state
  const { x, y, radius } = ball
  ball.xDir *= x < radius || x > 127 - radius ? -1 : 1
  ball.yDir *= y < radius ? -1 : 1
}

const loseDeadBall = state => {
  const { ball } = state
  if (ball.y > 128 - ball.radius) {
    ball.x = script8.initialState.ball.x
    ball.y = script8.initialState.ball.y
    ball.yDir = script8.initialState.ball.yDir
    ball.xDir = script8.initialState.ball.xDir
    state.lives -= 1
    if (state.lives < 1) {
      state.mode = modes.over
    }
  }
}

const bounceOffPaddle = state => {
  const { ball, paddle } = state
  if (
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.y >= paddle.y - paddle.height &&
    ball.y <= paddle.y
  ) {
    ball.yDir = -Math.abs(ball.yDir)
    state.score++
  }
}

const movePaddle = (state, input) => {
  state.paddle.x += input.left ? -3 : input.right ? 3 : 0
}

const moveBall = state => {
  const { ball } = state
  ball.x += ball.xDir
  ball.y += ball.yDir
}

script8.update = (state, input) => {
  switch (state.mode) {
    case modes.start: {
      if (input.start) {
        state.mode = modes.play
      }
      break
    }
    case modes.play: {
      movePaddle(state, input)
      bounceOffWalls(state)
      bounceOffPaddle(state)
      moveBall(state)
      loseDeadBall(state)
      break
    }
    case modes.over: {
      if (input.start) {
        state.mode = modes.play
        state.lives = script8.initialState.lives
        state.score = script8.initialState.score
      }
      break
    }
  }
}

script8.actors = ['paddle', 'ball']

const draw = {
  ball ({ x, y, radius, fade }) {
    circFill(x, y, radius, fade ? 4 : 0)
  },
  paddle ({ x, y, width, height, fade }) {
    rectFill(x, y, width, height, fade ? 5 : 2)
  }
}

script8.drawActors = (state, fade) => {
  script8.actors.forEach(actor => {
    draw[actor]({ ...state[actor], fade })
  })
}

script8.draw = state => {
  clear()
  rectFill(0, 0, 128, 128, 6)
  const { score, lives, mode } = state
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
      script8.drawActors(state)
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
