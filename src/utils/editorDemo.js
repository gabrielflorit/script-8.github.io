const demo = `

padx=52 * 2
pady=122 * 2
padw=24 * 2
padh=4 * 2
ballx=64 * 2
bally=64 * 2
ballsize=3 * 2
ballxdir=5 * 2
ballydir=-3 * 2

moveball = function () {
  ballx += ballxdir
  bally += ballydir
}

bounceball = function() {
  if (ballx < ballsize) ballxdir = -ballxdir
  if (ballx > 256 - ballsize) ballxdir = -ballxdir
  if (bally < ballsize) ballydir = -ballydir
}

movepaddle = function () {
  if (arrowLeft()) padx -= 3
  if (arrowRight()) padx += 3
}

bouncepaddle = function () {
  if (ballx >= padx &&
      ballx <= (padx + padw) &&
      bally > pady) {
    ballydir =- ballydir
  }
}

losedeadball = function () {
  if (bally > 256) bally = 48
}

update = function () {
  movepaddle()
  moveball()
  bounceball()
  bouncepaddle()
  losedeadball()
}

draw = function () {
  ctx.fillStyle = 'white'
  ctx.fillRect(padx, pady, padw, padh)

  ctx.beginPath()
  ctx.fillStyle = 'red'
  ctx.arc(ballx, bally, ballsize, 0, Math.PI * 2)
  ctx.fill()
}

`

export default demo