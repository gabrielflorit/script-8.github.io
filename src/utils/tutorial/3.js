export default `
const paddle = { x: 52, y: 122, width: 24, height: 4 }

script8.update = function () {

}

script8.draw = function () {

  // draw background
  rectFill(0, 0, 128, 128, 6)

  // draw paddle
  rectFill(paddle.x, paddle.y, paddle.width, paddle.height, 3)

  // draw ball
  circFill(64, 64, 4, 1)

}`
