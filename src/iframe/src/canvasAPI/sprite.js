import clamp from 'lodash/clamp'
import colors from '../colors.js'

const sprite = ({
  x,
  y,
  spriteIndex,
  darken = 0,
  flipH = false,
  flipV = false,
  sprites,
  ctx
}) => {
  if (sprites[spriteIndex]) {
    sprites[spriteIndex].slice(0, 8).forEach((cells, rowIndex) => {
      cells.split('').forEach((color, colIndex) => {
        if (color !== ' ') {
          const clamped = clamp(+color - darken, 0, 7)
          ctx.fillStyle = colors.rgb(clamped)
          ctx.fillRect(
            Math.floor(x) + (flipH ? 7 - colIndex : colIndex),
            Math.floor(y) + (flipV ? 7 - rowIndex : rowIndex),
            1,
            1
          )
        }
      })
    })
  }
}

const pixelSprite = ({ x, y, grid, ctx }) => {
  grid.slice(0, 8).forEach((cells, rowIndex) => {
    cells.split('').forEach((color, colIndex) => {
      if (color !== ' ') {
        ctx.fillStyle = colors.rgb(+color)
        ctx.fillRect(Math.floor(x) + colIndex, Math.floor(y) + rowIndex, 1, 1)
      }
    })
  })
}

export { pixelSprite }

export default sprite
