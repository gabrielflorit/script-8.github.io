import colors from '../colors.js'
import circle from './circle.js'
import print from './print.js'

const canvasAPI = ({
  ctx,
  width: canvasWidth,
  height: canvasHeight,
  sprites
}) => {
  const _sprites = sprites

  return {
    lineH (x, y, l, c, dotted) {
      if (dotted) {
        ctx.setLineDash([1, 1])
      }
      ctx.strokeStyle = colors.rgb(c)
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
      ctx.strokeStyle = colors.rgb(c)
      ctx.beginPath()
      ctx.moveTo(Math.floor(x) + 0.5, Math.floor(y))
      ctx.lineTo(Math.floor(x) + 0.5, Math.floor(y + l))
      ctx.stroke()
      ctx.setLineDash([])
    },

    print (x, y, letters, c) {
      print({ x, y, letters, c, ctx })
    },

    rectStroke (x, y, w, h, c) {
      ctx.strokeStyle = colors.rgb(c)
      ctx.strokeRect(
        Math.floor(x) + 0.5,
        Math.floor(y) + 0.5,
        Math.floor(w) - 1,
        Math.floor(h) - 1
      )
    },

    rectFill (x, y, w, h, c) {
      ctx.fillStyle = colors.rgb(c)
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
    },

    sprite (x, y, spriteIndex) {
      if (_sprites[spriteIndex]) {
        _sprites[spriteIndex].forEach((cells, rowIndex) => {
          cells.split('').forEach((color, colIndex) => {
            if (color !== ' ') {
              ctx.fillStyle = colors.rgb(color)
              ctx.fillRect(
                Math.floor(x) + colIndex,
                Math.floor(y) + rowIndex,
                1,
                1
              )
            }
          })
        })
      }
    },

    circStroke (x, y, r, c) {
      circle({
        cx: Math.floor(x),
        cy: Math.floor(y),
        radius: Math.floor(r),
        ctx,
        color: colors.rgb(c),
        onlyStroke: true
      })
    },

    circFill (x, y, r, c) {
      circle({
        cx: Math.floor(x),
        cy: Math.floor(y),
        radius: Math.floor(r),
        ctx,
        color: colors.rgb(c)
      })
    },

    clear () {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    }
  }
}

export default canvasAPI
