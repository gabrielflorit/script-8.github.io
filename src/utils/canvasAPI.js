import _ from 'lodash'
import colors from './colors.js'
import circle from './circle.js'
import alphabet from './alphabet.js'

const canvasAPI = ({ ctx, size }) => ({
  print (x, y, text, c) {
    const color = colors.rgb(c)

    text.split('').forEach((letter, i) => {
      const imageData = ctx.getImageData(x + 4 * i, y, 3, 5)
      const { data } = imageData

      const match = alphabet[letter] || alphabet[' ']
      const bits = _.flatten(match.map(d => [...color, d]))

      for (var j = 0; j < data.length; j += 4) {
        if (bits[j + 3] === 1) {
          data[j + 0] = bits[j + 0]
          data[j + 1] = bits[j + 1]
          data[j + 2] = bits[j + 2]
          data[j + 3] = 255
        }
      }

      ctx.putImageData(imageData, x + 4 * i, y)
    })
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
    ctx.clearRect(0, 0, size, size)
  }
})

export default canvasAPI
