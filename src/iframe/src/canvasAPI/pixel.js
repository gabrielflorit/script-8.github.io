import colors from '../colors.js'

const getPixel = ({ x, y, ctx }) => {
  x = x % 128
  y = y % 128
  let pixel = ctx.getImageData(x, y, 1, 1).data
  let triplet = [
    pixel[0],
    pixel[1],
    pixel[2]
  ]
  let color = colors.lookup(triplet)
  if (typeof color === "undefined") {
    return 7
  }
  return color
}

const setPixel = ({ x, y, ctx, color }) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

export { getPixel, setPixel }
