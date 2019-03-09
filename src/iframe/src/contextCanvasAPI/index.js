import { get, isNil } from 'lodash'
import colors from '../colors.js'
import circle from './circle.js'
import line from './line.js'
import polyStroke from './polyStroke.js'
import print from './print.js'
import sprite, { pixelSprite } from './sprite.js'
import { getPixel, setPixel } from './pixel.js'

// let mapDraws = []
// let avgDraws = []
// let draws = 0
// let skips = 0

const canvasAPI = ({
  ctx,
  width: canvasWidth,
  height: canvasHeight,
  sprites,
  map = []
}) => {
  let _runningMap = JSON.parse(JSON.stringify(map))
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  let _cameraX = 0

  let _cameraY = 0

  const _memoryCanvas = document.createElement('canvas')
  _memoryCanvas.width = canvasWidth
  _memoryCanvas.height = canvasHeight
  const _mCtx = _memoryCanvas.getContext('2d')

  Object.entries(sprites).forEach(([skey, value]) => {
    const key = +skey
    const row = Math.floor(key / 16)
    const col = key % 16
    pixelSprite({ x: col * 8, y: row * 8, grid: value, ctx: _mCtx })
  })

  return {
    polyStroke(points, ...args) {
      polyStroke({ points, args, ctx })
    },

    getTile(mx, my) {
      const tile = get(_runningMap, [my, mx], null)
      let result = tile !== null ? sprites[tile] : null
      if (result) {
        result.type = result[8] || 0
        result.number = tile
      }
      return result
    },

    setTile(mx, my, spriteNumber) {
      _runningMap[my][mx] = spriteNumber
    },

    line(x1, y1, x2, y2, c = 0) {
      line({
        x1: Math.floor(x1),
        y1: Math.floor(y1),
        x2: Math.floor(x2),
        y2: Math.floor(y2),
        ctx,
        color: colors.rgb(c)
      })
    },

    print(x, y, letters, c = 0) {
      print({
        x: x - _cameraX,
        y: y - _cameraY,
        letters,
        c,
        ctx
      })
    },

    rectStroke(x, y, w, h, c = 0) {
      ctx.strokeStyle = colors.rgb(c)
      ctx.strokeRect(
        Math.floor(x) + 0.5,
        Math.floor(y) + 0.5,
        Math.floor(w) - 1,
        Math.floor(h) - 1
      )
    },

    camera(x = 0, y = 0) {
      _cameraX = Math.floor(x)
      _cameraY = Math.floor(y)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.translate(-_cameraX, -_cameraY)
    },

    rectFill(x, y, w, h, c = 0) {
      ctx.fillStyle = colors.rgb(c)
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
    },

    resetMap() {
      _runningMap = JSON.parse(JSON.stringify(map))
    },

    map(x = 0, y = 0) {
      // const before = Date.now()
      _runningMap.forEach((row, rowNumber) => {
        row.forEach((spriteIndex, colNumber) => {
          if (spriteIndex !== null) {
            const sx = (spriteIndex % 16) * 8
            const sy = Math.floor(spriteIndex / 16) * 8
            const sWidth = 8
            const sHeight = 8
            const dx = (colNumber + x) * 8
            const dy = rowNumber * 8
            const dWidth = 8
            const dHeight = 8

            if (
              dx + 7 >= _cameraX &&
              dx < _cameraX + 128 &&
              dy + 7 >= _cameraY &&
              dy < _cameraY + 128
            ) {
              // ++draws
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
            } else {
              // ++skips
            }
          }
        })
      })

      // const after = Date.now()
      // mapDraws.push(after - before)
      // if (mapDraws.length > 60) {
      //   const avg = sum(mapDraws) / mapDraws.length
      //   // console.log(`map() avg: ${sum(mapDraws) / mapDraws.length}ms`)
      //   // console.log({ _cameraX, _cameraY })
      //   mapDraws = []
      //   avgDraws.push(avg)
      //   if (avgDraws.length % 10 === 0) {
      //     console.log(`AVG AVG: ${sum(avgDraws) / avgDraws.length}ms`)
      //     console.log(`DRAWS/SKIPS: ${draws / skips} (${draws}/${skips})`)
      //   }
      // }
    },

    sprite(x, y, spriteIndex, darken = 0, flipH = false, flipV = false) {
      sprite({
        x,
        y,
        spriteIndex,
        darken,
        flipH,
        flipV,
        sprites,
        ctx
      })
    },

    circStroke(x, y, r, c = 0) {
      circle({
        cx: Math.floor(x),
        cy: Math.floor(y),
        radius: Math.floor(r),
        ctx,
        color: colors.rgb(c),
        onlyStroke: true
      })
    },

    circFill(x, y, r, c = 0) {
      circle({
        cx: Math.floor(x),
        cy: Math.floor(y),
        radius: Math.floor(r),
        ctx,
        color: colors.rgb(c)
      })
    },

    clear(c) {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      if (!isNil(c)) {
        ctx.fillStyle = colors.rgb(c)
        ctx.fillRect(0, 0, 128, 128)
      } else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      }
      ctx.restore()
    },

    getPixel(x, y) {
      return getPixel({
        x: Math.floor(x - _cameraX),
        y: Math.floor(y - _cameraY),
        ctx
      })
    },

    setPixel(x, y, c = 0) {
      setPixel({
        x: Math.floor(x),
        y: Math.floor(y),
        ctx,
        color: colors.rgb(c)
      })
    }
  }
}

export default canvasAPI
