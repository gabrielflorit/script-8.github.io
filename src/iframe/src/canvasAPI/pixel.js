import colors from '../colors.js'

const getPixel = ({ x, y, ctx }) => {
  let triplet = ctx.getImageData(x, y, 1, 1).data
  return colors.lookup(triplet)
}

const setPixel = ({ x, y, ctx, color }) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, 1, 1)
}

export { getPixel, setPixel }
