import colors from '../colors.js'

const backgroundColor = 7

const getPixel = ({ x, y, ctx }) => {
  x = x % 128
  y = y % 128

  // pixel: [r, g, b, a]
  let pixel = ctx.getImageData(x, y, 1, 1).data

  // If pixel isn't opaque default
  if (pixel[3] !== 255) return backgroundColor

  let color = colors.lookup(pixel)
  // If color wasn't recognized return default
  if (typeof color === "undefined") {
    return backgroundColor
  }

  return color
}

const setPixel = ({ x, y, ctx, color }) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

export { getPixel, setPixel }
