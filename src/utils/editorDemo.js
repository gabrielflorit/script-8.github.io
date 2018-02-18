const demo = `padx=52 * 2
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











// const demo = `import createPathAnchors from './createPathAnchors.js'

// const { parkPrepareFactor, parkingStaggerDelay } = dimensions

// const animate = ({ mode, names, onFinish, racers, svgOptions }) => {
//   // Choose models from names.
//   const competitors = racers.filter(d => names.indexOf(d.name) !== -1)

//   const anchors = competitors.map((competitor, i) =>
//     createPathAnchors[mode]({
//       parkPosition: competitor.parkPosition
//     })
//   )

//   const { compoundLength } = svgOptions

//   // Create the animations.
//   let animationsFinished = 0
//   const animations = paths
//     .map((path, i) =>
//       createAnimation({
//         coords: path.coords,
//         racer: competitors[i],
//         duration:
//           mode === 'race'
//             ? competitors[i].duration
//             : parkPrepareFactor * path.totalLength / compoundLength,
//         onFinishCallback () {
//           animationsFinished++
//           if (animationsFinished === paths.length) {
//             onFinish && onFinish()
//           }
//         }
//       })
//     )
//     .reverse()

//   // Start the animations,
//   animations.forEach((animation, i) => {
//     // but if we're not racing, don't start them both at the same time.
//     const delay =
//       mode === 'race'
//         ? 0
//         : mode === 'prepare'
//           ? i * parkingStaggerDelay / 2
//           : i * parkingStaggerDelay * 2

//     timerManager.timeout(() => {
//       animation.stop()
//       animation.start()
//     }, delay)
//   })
// }

// export default animate
// `





