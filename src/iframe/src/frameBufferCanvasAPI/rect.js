export const drawRectStroke = ({ x, y, w, h, c, line }) => {
  let left = Math.floor(x)
  let right = Math.floor(x + w - 1)
  let top = Math.floor(y)
  let bottom = Math.floor(y + h - 1)
  line(left, top, right, top, c)
  line(left, bottom, right, bottom, c)
  line(left, top, left, bottom, c)
  line(right, top, right, bottom, c)
}

export const drawRectFill = ({ x, y, w, h, c, line }) => {
  let left = Math.floor(x)
  let right = Math.floor(x + w - 1)
  let top = Math.floor(y)
  let bottom = Math.floor(y + h - 1)

  for (let rectX = left; rectX <= right; rectX++) {
    line(rectX, top, rectX, bottom, c)
  }
}
