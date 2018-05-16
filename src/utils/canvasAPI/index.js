import colors from '../colors.js'
import circle from './circle.js'
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
    ctx.fillStyle = colors.one(c)
    let steep = false
    if (Math.abs(x1 - x2) < Math.abs(y1 - y2)) {
      [x1, y1] = [y1, x1];
      [x2, y2] = [y2, x2];
      steep = true
    }
    if (x1 > x2) {
      [x1, x2] = [x2, x1];
      [y1, y2] = [y2, y1];
    }
    let dx = x2 - x1
    let dy = y2 - y1
    let derror = Math.abs(dy) * 2
    let error = 0
    let y = y1
    for (let x = x1; x <= x2; x++) {
      if (steep) {
        ctx.fillRect(
          Math.round(y) + 0.5,
          Math.round(x) + 0.5,
          1, 1
        )
      } else {
        ctx.fillRect(
          Math.round(x) + 0.5,
          Math.round(y) + 0.5,
          1, 1
        )
      }
      error += derror
      if (error > dx) {
        if (y2 > y1) {
            y++
        } else {
            y--
        }
        error -= dx * 2
      }
    }
  }

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
    let c, new_points
    switch (args.length) {
      case 1:
        c = args[0]
        new_points = points.map(p => [...p])
        break
      case 2:
        c = args[1]
        let x_rot = Math.cos(args[0])
        let y_rot = Math.sin(args[0])
        let xs = points.map(p => p[0])
        let ys = points.map(p => p[1])
        let mid_x = (Math.min.apply(Math, xs) + Math.max.apply(Math, xs)) / 2
        let mid_y = (Math.min.apply(Math, ys) + Math.max.apply(Math, ys)) / 2
        new_points = points.map(p => [
          ((p[0] - mid_x) * x_rot - (p[1] - mid_y) * y_rot) + mid_x,
          ((p[0] - mid_x) * y_rot + (p[1] - mid_y) * x_rot) + mid_y
        ])
        break
      case 3:
        throw "`polyStroke` found 3 arguments instead of 2, 3, or 5."
      default:
        c = args[3]
        let x_rot = Math.cos(args[0])
        let y_rot = Math.sin(args[0])
        let mid_x = args[1]
        let mid_y = args[2]
        new_points = points.map(p => [
          ((p[0] - mid_x) * x_rot - (p[1] - mid_y) * y_rot) + mid_x,
          ((p[0] - mid_x) * y_rot + (p[1] - mid_y) * x_rot) + mid_y
        ])
        break
    }
    for (let i = 1; i < points.length; i++) {
      canvasAPI({ ctx, width: canvasWidth, height: canvasHeight }).line(
        c,
        new_points[i - 1][0], new_points[i - 1][1],
        new_points[i][0], new_points[i][1]
      )
    }
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
