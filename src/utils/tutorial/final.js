const pad = { x: 64 - 24 / 2, y: 128 - 4 - 2, width: 24, height: 4 }
const ball = { x: 64, y: 64, radius: 4, xDir: 4, yDir: -3 }
let score = 0
let lives = 3

function movePaddle () {
  if (arrowLeft) pad.x -= 3
  if (arrowRight) pad.x += 3
}

function moveBall () {
  ball.x += ball.xDir
  ball.y += ball.yDir
}

function bounceBall () {
  // bounce left
  if (ball.x < ball.radius) ball.xDir *= -1
  // bounce right
  if (ball.x > 128 - ball.radius) ball.xDir *= -1
  // bounce top
  if (ball.y < ball.radius) ball.yDir *= -1
}

function bouncePaddle () {
  if (
    ball.x >= pad.x &&
    ball.x <= pad.x + pad.width &&
    ball.y > pad.y - pad.height
  ) {
    ball.yDir *= -1
    score += 10
  }
}

function loseDeadBall () {
  if (ball.y > 128 - ball.radius) {
    lives -= 1
    if (lives > 0) {
      ball.y = 24
    } else {
      ball.yDir = 0
      ball.xDir = 0
      ball.y = 64
      ball.x = 64
    }
  }
}

function drawHeart (x, y, c) {
  const grid = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0]
  ]

  grid.forEach((cols, row) => {
    cols.forEach((value, col) => {
      if (value) rectFill(col + x, row + y, 1, 1, c)
    })
  })
}

script8.update = function () {
  movePaddle()
  bounceBall()
  bouncePaddle()
  moveBall()
  loseDeadBall()
}

script8.draw = function () {
  // clear
  rectFill(0, 0, 128, 128, 6)

  // if no lives left, display game over
  if (lives < 1) {
    print(47, 34, 'game over', 0)
    print(47, 44, `score  ${score}`, 2)
  } else {
    // draw score
    print(12, 6, score, 3)
  }

  // draw hearts
  range(lives).forEach((i, _, a) => {
    drawHeart(90 + i * 8, 4, i === a.length - 1 ? 1 : 3)
  })

  // draw paddle
  rectFill(pad.x, pad.y, pad.width, pad.height, 3)
  rectStroke(pad.x, pad.y, pad.width, pad.height, 2)

  // draw ball
  circFill(ball.x, ball.y, ball.radius, 1)
  circStroke(ball.x, ball.y, ball.radius, 0)
}
