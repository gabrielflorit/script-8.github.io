// title: Break-8
/* eslint-disable no-global-assign */

const e = {
  paddle: {
    width: 16,
    height: 5,
    color: 2
  },
  ball: {
    radius: 3, // this is width 5
    color: 0
  }
}

initialState = {
  actors: [
    {
      name: 'paddle',
      x: 64 - e.paddle.width / 2,
      y: 128 - 8
    },
    {
      name: 'ball',
      x: 24,
      y: e.ball.radius,
      dx: -1,
      dy: 1
    }
  ]
}

const movePaddle = (paddle, input) => {
  if (input.left && paddle.x > 0) paddle.x -= 1
  if (input.right && paddle.x < 128 - e.paddle.width) paddle.x += 1
}

const bounceBallOffWalls = ball => {
  if (ball.x > 128 - e.ball.radius) ball.dx *= -1
  if (ball.x < 0 + e.ball.radius) ball.dx *= -1
  if (ball.y > 128 - e.ball.radius) ball.dy *= -1
  if (ball.y < 0 + e.ball.radius) ball.dy *= -1
}

const bounceBallOffPaddle = (ball, paddle) => {
  if (
    ball.y + e.ball.radius >= paddle.y &&
    ball.x + e.ball.radius >= paddle.x &&
    ball.x - e.ball.radius <= paddle.x + e.paddle.width
  ) {
    ball.dy *= -1
  }
  // if (ball.x - ball.radius >= paddle.x) ball.dy *= -1
}

const moveBall = ball => {
  ball.x += ball.dx
  ball.y += ball.dy
}

update = (state, input) => {
  const paddle = state.actors.find(d => d.name === 'paddle')
  const ball = state.actors.find(d => d.name === 'ball')

  movePaddle(paddle, input)
  bounceBallOffWalls(ball)
  bounceBallOffPaddle(ball, paddle)
  moveBall(ball)
}

const drawActor = (actor, fade) => {
  if (actor.name === 'paddle') {
    rectFill(
      actor.x,
      actor.y,
      e.paddle.width,
      e.paddle.height,
      e.paddle.color + (fade ? 5 : 0)
    )
  }
  if (actor.name === 'ball') {
    circFill(actor.x, actor.y, e.ball.radius, e.ball.color + (fade ? 5 : 0))
  }
}

drawActors = (state, fade) => {
  state.actors.forEach(actor => drawActor(actor, fade))
}

draw = state => {
  clear()
  rectStroke(0, 0, 128, 128, 6)
  drawActors(state)
}
