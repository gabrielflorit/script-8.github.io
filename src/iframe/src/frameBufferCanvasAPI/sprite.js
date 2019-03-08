import clamp from 'lodash/clamp'

const drawSprite = ({ x, y, spriteIndex, darken, flipH, flipV, setPixel, sprites }) => {
  if (sprites[spriteIndex]) {
    sprites[spriteIndex].slice(0, 8).forEach((cells, rowIndex) => {
      cells.split('').forEach((color, colIndex) => {
        if (color !== ' ') {
          const clamped = clamp(+color - darken, 0, 7)
          setPixel(
            Math.floor(x) + (flipH ? 7 - colIndex : colIndex),
            Math.floor(y) + (flipV ? 7 - rowIndex : rowIndex),
            clamped)
        }
      })
    })
  }
}

export default drawSprite
