const drawLine = ({ x0, x1, y, ctx }) => {
  ctx.beginPath()
  ctx.moveTo(x0 + 1, y + 0.5)
  ctx.lineTo(x1, y + 0.5)
  ctx.stroke()
}

const fillCircle = ({ cx, cy, radius, ctx, color }) => {
  let x = radius - 1
  let y = 0
  let dx = 1
  let dy = 1
  let err = dx - (radius << 1)

  ctx.strokeStyle = color

  while (x >= y) {
    drawLine({ x0: cx + y, x1: cx - y, y: cy - x, ctx })
    drawLine({ x0: cx + x, x1: cx - x, y: cy - y, ctx })
    drawLine({ x0: cx + x, x1: cx - x, y: cy + y, ctx })
    drawLine({ x0: cx + y, x1: cx - y, y: cy + x, ctx })

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

export default fillCircle
