import _ from 'lodash'
import colors from './colors.js'
import circle from './circle.js'
import alphabet from './alphabet.js'

const canvasAPI = ({ ctx, size }) => ({
  print (x, y, letters, c) {
    const color = colors.rgb(c)

    const grids = letters
      // Split into individual letters.
      .split('')
      // Get the pixels and the letter's width.
      .map(letter => {
        const pixels = alphabet[letter.toLowerCase()]
        return {
          width: pixels ? pixels.length / 6 : 3,
          letter,
          pixels
        }
      })
      // Calculate the running letter position.
      .reduce((acc, current, index, array) => {
        return [
          ...acc,
          {
            ...current,
            position: acc.length
              ? acc[index - 1].width + 1 + acc[index - 1].position
              : 0
          }
        ]
      }, [])
      // Ignore letters with no matches.
      .filter(d => d.pixels)

    // For each grid of pixels,
    grids.forEach(grid => {

      // get some properties,
      const { pixels, position, width } = grid

      // get the image data this letter will occupy,
      const imageData = ctx.getImageData(x + position, y, width, 6)
      const { data } = imageData

      // and for each pixel,
      pixels
        .map((pixel, pixelIndex) => ({ pixel, pixelIndex }))
        // ignore pixels set to 0,
        .filter(d => d.pixel)
        // and update the underlying canvas data.
        .forEach(d => {
          const offset = d.pixelIndex * 4
          data[offset + 0] = color[0]
          data[offset + 1] = color[1]
          data[offset + 2] = color[2]
          data[offset + 3] = 255
        })

      // And draw!
      ctx.putImageData(imageData, x + position, y)
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
