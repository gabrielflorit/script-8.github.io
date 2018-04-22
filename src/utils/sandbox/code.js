const modes = {
  start: 'start',
  play: 'play',
  over: 'over'
}
const ballTemplate = {
  type: 'ball',
  x: 64,
  y: 64,
  xDir: 3,
  yDir: -1,
  radius: 6,
  color: 0
}

script8.initialState = {
  actors: [
    {
      ...ballTemplate
    },
    {
      type: 'paddle',
      x: 64,
      y: 120,
      width: 36,
      height: 4,
      color: 2
    }
  ],
  score: 0,
  lives: 3,
  mode: modes.start
}

const bounceOffWalls = state => {
  state.actors.filter(d => d.type === 'ball').forEach(ball => {
    const { x, y, radius } = ball
    ball.xDir *= x < radius || x > 127 - radius ? -1 : 1
    ball.yDir *= y < radius ? -1 : 1
  })
}

const loseDeadBall = state => {
  state.actors.filter(d => d.type === 'ball').forEach((ball, i) => {
    if (ball.y > 128 - ball.radius) {
      ball.x = ballTemplate.x
      ball.y = ballTemplate.y
      ball.xDir = ballTemplate.xDir
      ball.yDir = ballTemplate.yDir
      state.lives -= 1
      if (state.lives < 1) {
        state.mode = modes.over
      }
    }
  })
}

const bounceOffPaddle = state => {
  const paddle = state.actors.find(d => d.type === 'paddle')
  const newBalls = []
  state.actors.filter(d => d.type === 'ball').forEach(ball => {
    if (
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width &&
      ball.y >= paddle.y - paddle.height &&
      ball.y <= paddle.y
    ) {
      ball.yDir = -Math.abs(ball.yDir)
      state.score++
      const jump = 3
      if (state.score === jump || state.score === jump * 2) {
        const newBall = {
          ...ballTemplate
        }
        const delta = Math.floor(state.score / jump)
        newBall.color += delta
        newBall.radius -= delta
        newBalls.push(newBall)
      }
    }
  })
  newBalls.forEach(ball => {
    state.actors.push(ball)
  })
}

const movePaddle = (state, input) => {
  const paddle = state.actors.find(d => d.type === 'paddle')
  paddle.x += input.left ? -3 : input.right ? 3 : 0
  paddle.x = Math.max(0, paddle.x)
  paddle.x = Math.min(128 - paddle.width, paddle.x)
}

const moveBall = state => {
  state.actors.filter(d => d.type === 'ball').forEach(ball => {
    ball.x += ball.xDir
    ball.y += ball.yDir
  })
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
        state.actors = script8.initialState.actors.map(d => ({
          ...d
        }))
      }
      break
    }
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
