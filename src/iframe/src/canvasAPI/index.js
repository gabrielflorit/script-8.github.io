import colors from '../colors.js'
import circle from './circle.js'
import line from './line.js'
import polyStroke from './polyStroke.js'
import print from './print.js'
import sprite from './sprite.js'

const canvasAPI = ({
  ctx,
  width: canvasWidth,
  height: canvasHeight,
  sprites,
  rooms
}) => {
  const _sprites = sprites
  const _rooms = rooms

  return {
    polyStroke (points, ...args) {
      polyStroke({ points, args, ctx })
    },

    tile (x, y, roomIndex) {
      const room = _rooms[roomIndex]
      return room ? room[y][x] : null
    },

    line (x1, y1, x2, y2, c) {
      line({
        x1: Math.floor(x1),
        y1: Math.floor(y1),
        x2: Math.floor(x2),
        y2: Math.floor(y2),
        ctx,
        color: colors.rgb(c)
      })
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

    room (roomIndex) {
      const room = _rooms[roomIndex]
      if (room) {
        room.forEach((row, rowNumber) => {
          row.forEach((col, colNumber) => {
            sprite({
              x: colNumber * 8,
              y: rowNumber * 8,
              spriteIndex: col,
              sprites: _sprites,
              ctx
            })
          })
        })
      }
    },

    sprite (x, y, spriteIndex, darken = 0, flip = false) {
      sprite({ x, y, spriteIndex, darken, flip, sprites: _sprites, ctx })
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
