import colors from '../colors.js'
import circle from './circle.js'
import line from './line.js'
import print from './print.js'

const canvasAPI = ({ ctx, width: canvasWidth, height: canvasHeight }) => ({
  lineH (x, y, l, c, dotted) {
    if (dotted) {
      ctx.setLineDash([1, 1])
    }
    ctx.strokeStyle = colors.one(c)
    ctx.beginPath()
    ctx.moveTo(Math.floor(x), Math.floor(y) + 0.5)
    ctx.lineTo(Math.floor(x + l), Math.floor(y) + 0.5)
    ctx.stroke()
    ctx.setLineDash([])
  },

  lineV (x, y, l, c, dotted) {
    if (dotted) {
      ctx.setLineDash([1, 1])
    }
    ctx.strokeStyle = colors.one(c)
    ctx.beginPath()
    ctx.moveTo(Math.floor(x) + 0.5, Math.floor(y))
    ctx.lineTo(Math.floor(x) + 0.5, Math.floor(y + l))
    ctx.stroke()
    ctx.setLineDash([])
  },
  
  line (x1, y1, x2, y2, c) {
    line({
      Math.floor(x1), Math.floor(y1),
      Math.floor(x2), Math.floor(y2),
      ctx,
      color: colors.one(c)
    })
  },

  print (x, y, letters, c) {
    print({ x, y, letters, c, ctx })
  },

  rectStroke (x, y, w, h, c) {
    ctx.strokeStyle = colors.one(c)
    ctx.strokeRect(
      Math.floor(x) + 0.5,
      Math.floor(y) + 0.5,
      Math.floor(w) - 1,
      Math.floor(h) - 1
    )
  },

  rectFill (x, y, w, h, c) {
    ctx.fillStyle = colors.one(c)
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
  },

  polyStroke (points, ...args) {
    if (!points.length) {
      return
    }
    let
      c,
      new_points,
      x_rot, y_rot,
      mid_x, mid_y
    switch (args.length) {
      case 1:
        c = args[0]
        new_points = points.map(p => [...p])
        break
      case 2:
        c = args[1]
        x_rot = Math.cos(args[0])
        y_rot = Math.sin(args[0])
        let xs = points.map(p => p[0])
        let ys = points.map(p => p[1])
        mid_x = (Math.min.apply(Math, xs) + Math.max.apply(Math, xs)) / 2
        mid_y = (Math.min.apply(Math, ys) + Math.max.apply(Math, ys)) / 2
        new_points = points.map(p => [
          ((p[0] - mid_x) * x_rot - (p[1] - mid_y) * y_rot) + mid_x,
          ((p[0] - mid_x) * y_rot + (p[1] - mid_y) * x_rot) + mid_y
        ])
        break
      case 3:
        throw "`polyStroke` found 3 arguments instead of 2, 3, or 5."
      default:
        c = args[3]
        x_rot = Math.cos(args[0])
        y_rot = Math.sin(args[0])
        mid_x = args[1]
        mid_y = args[2]
        new_points = points.map(p => [
          ((p[0] - mid_x) * x_rot - (p[1] - mid_y) * y_rot) + mid_x,
          ((p[0] - mid_x) * y_rot + (p[1] - mid_y) * x_rot) + mid_y
        ])
        break
    }
    for (let i = 1; i < points.length; i++) {
      line({
        x1: Math.round(new_points[i - 1][0]), y1: Math.round(new_points[i - 1][1]),
        x2: Marh.round(new_points[i][0]), y2: Math.round(new_points[i][1]),
        ctx,
        color: c
      })
    }
    line({
      x1: Math.round(new_points[new_points.length - 1][0]), y1: Math.round(new_points[new_points.length - 1][1]),
      x2: Math.round(new_points[0][0]), y2: Math.round(new_points[0][1]),
      ctx,
      color: c
    })
  },

  circStroke (x, y, r, c) {
    circle({
      cx: Math.floor(x),
      cy: Math.floor(y),
      radius: Math.floor(r),
      ctx,
      color: colors.one(c),
      onlyStroke: true
    })
  },

  circFill (x, y, r, c) {
    circle({
      cx: Math.floor(x),
      cy: Math.floor(y),
      radius: Math.floor(r),
      ctx,
      color: colors.one(c)
    })
  },

  clear () {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  }
})

export default canvasAPI
