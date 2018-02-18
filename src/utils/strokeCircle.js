const drawPixel = (x, y, ctx) => {
  ctx.fillRect(x, y, 1, 1)
}

const strokeCircle = ({ cx, cy, radius, ctx, color }) => {
  let x = radius - 1
  let y = 0
  let dx = 1
  let dy = 1
  let err = dx - (radius << 1)

  ctx.fillStyle = color

  while (x >= y) {
    drawPixel(cx + x, cy + y, ctx)
    drawPixel(cx - x, cy + y, ctx)

    drawPixel(cx + y, cy + x, ctx)
    drawPixel(cx - y, cy + x, ctx)

    drawPixel(cx + x, cy - y, ctx)
    drawPixel(cx - x, cy - y, ctx)

    drawPixel(cx + y, cy - x, ctx)
    drawPixel(cx - y, cy - x, ctx)

    if (err <= 0) {
      y++
      err += dy
      dy += 2
    }

    if (err > 0) {
      x--
      dx += 2
      err += dx - (radius << 1)
    }
  }
}

export default strokeCircle
