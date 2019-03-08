import colors from '../colors.js'

const backgroundColor = 7

const getPixel = ({ x, y, ctx }) => {
  // pixel: [r, g, b, a]
  const [r, g, b, alpha] = ctx.getImageData(x, y, 1, 1).data

  // If pixel isn't opaque, return default.
  if (alpha !== 255) {
    return backgroundColor
  }

  // If color wasn't recognized, return default.
  const color = colors.lookup([r, g, b, alpha])
  if (color === null) {
    return backgroundColor
  }

  return color
}

const setPixel = ({ x, y, ctx, color }) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

export { getPixel, setPixel }
