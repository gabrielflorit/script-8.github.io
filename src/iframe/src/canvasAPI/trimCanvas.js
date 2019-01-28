const trimCanvas = ({ ctx, width, height }) => {
  const pixels = ctx.getImageData(0, 0, width, height)
  const length = pixels.data.length
  let i
  const bound = {
    top: null,
    left: null,
    right: null,
    bottom: null
  }
  let x
  let y

  for (i = 0; i < length; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % width
      y = ~~(i / 4 / width)

      if (bound.top === null) {
        bound.top = y
      }

      if (bound.left === null) {
        bound.left = x
      } else if (x < bound.left) {
        bound.left = x
      }

      if (bound.right === null) {
        bound.right = x
      } else if (bound.right < x) {
        bound.right = x
      }

      if (bound.bottom === null) {
        bound.bottom = y
      } else if (bound.bottom < y) {
        bound.bottom = y
      }
    }
  }

  bound.bottom += 1
  bound.right += 1

  const copyCanvas = document.createElement('canvas')
  const copy = copyCanvas.getContext('2d')
  const trimHeight = bound.bottom - bound.top
  const trimWidth = bound.right - bound.left
  const side = Math.max(trimWidth, trimHeight)
  const trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight)

  copy.canvas.width = side
  copy.canvas.height = side
  copy.putImageData(trimmed, 0, 0)
  return copyCanvas
}

export default trimCanvas
