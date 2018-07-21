import { get } from 'lodash'
import colors from '../colors.js'
import circle from './circle.js'
import line from './line.js'
import polyStroke from './polyStroke.js'
import print from './print.js'
import sprite, { pixelSprite } from './sprite.js'

const canvasAPI = ({
  ctx,
  width: canvasWidth,
  height: canvasHeight,
  sprites,
  map
}) => {
  const _sprites = sprites
  const _map = map
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  const _memoryCanvas = document.createElement('canvas')
  _memoryCanvas.width = canvasWidth
  _memoryCanvas.height = canvasHeight
  const _mCtx = _memoryCanvas.getContext('2d')

  Object.entries(_sprites).forEach(([skey, value]) => {
    const key = +skey
    const row = Math.floor(key / 16)
    const col = key % 16
    pixelSprite({ x: col * 8, y: row * 8, grid: value, ctx: _mCtx })
  })

  return {
    polyStroke (points, ...args) {
      polyStroke({ points, args, ctx })
    },

    tile (x, y) {
      const thisTile = get(_map, [y, x], null)
      return thisTile !== null ? _sprites[thisTile] : null
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

    camera (x) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.translate(-x, 0)
    },

    rectFill (x, y, w, h, c) {
      ctx.fillStyle = colors.rgb(c)
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
    },

    map (x = 0, y = 0) {
      // const before = Date.now()
      _map.slice(y, y + 16).forEach((row, rowNumber) => {
        row.slice(x, x + 17).forEach((spriteIndex, colNumber) => {
          if (spriteIndex !== null) {
            const dx = (colNumber + x) * 8
            const dy = rowNumber * 8
            const sWidth = 8
            const sHeight = 8
            const sx = (spriteIndex % 16) * 8
            const sy = Math.floor(spriteIndex / 16) * 8
            const dWidth = 8
            const dHeight = 8

            ctx.drawImage(
              _memoryCanvas,
              sx,
              sy,
              sWidth,
              sHeight,
              dx,
              dy,
              dWidth,
              dHeight
            )
          }
        })
      })
      // const after = Date.now()
      // console.log(`map() took: ${after - before}ms`)
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
