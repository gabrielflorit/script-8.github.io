import colors from '../colors.js'
import line from './line.js'

const polyStroke = ({ points, args, ctx }) => {
  if (!points.length) {
    return
  }
  let c, newPoints, xRot, yRot, midX, midY
  switch (args.length) {
    case 1:
      // polyStroke(points, color)
      newPoints = points.map(p => [...p])
      c = args[0]
      break
    case 2:
      // polyStroke(points, rotate, color)
      xRot = Math.cos((args[0] / 180) * Math.PI)
      yRot = Math.sin((args[0] / 180) * Math.PI)
      const xs = points.map(p => p[0])
      const ys = points.map(p => p[1])
      midX = (Math.min.apply(Math, xs) + Math.max.apply(Math, xs)) / 2
      midY = (Math.min.apply(Math, ys) + Math.max.apply(Math, ys)) / 2
      newPoints = points.map(p => [
        (p[0] - midX) * xRot - (p[1] - midY) * yRot + midX,
        (p[0] - midX) * yRot + (p[1] - midY) * xRot + midY
      ])
      c = args[1]
      break
    case 3:
      throw Error('`polyStroke` found 3 arguments instead of 2, 3, or 5.')
    default:
      // polyStroke(points, rotate, x, y, color)
      xRot = Math.cos((args[0] / 180) * Math.PI)
      yRot = Math.sin((args[0] / 180) * Math.PI)
      midX = args[1]
      midY = args[2]
      c = args[3]
      newPoints = points.map(p => [
        (p[0] - midX) * xRot - (p[1] - midY) * yRot + midX,
        (p[0] - midX) * yRot + (p[1] - midY) * xRot + midY
      ])
      break
  }
  for (let i = 1; i < points.length; i++) {
    line({
      x1: Math.round(newPoints[i - 1][0]),
      y1: Math.round(newPoints[i - 1][1]),
      x2: Math.round(newPoints[i][0]),
      y2: Math.round(newPoints[i][1]),
      ctx,
      color: colors.rgb(c)
    })
  }
  line({
    x1: Math.round(newPoints[newPoints.length - 1][0]),
    y1: Math.round(newPoints[newPoints.length - 1][1]),
    x2: Math.round(newPoints[0][0]),
    y2: Math.round(newPoints[0][1]),
    ctx,
    color: colors.rgb(c)
  })
}

export default polyStroke
