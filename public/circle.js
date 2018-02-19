const circle = ({ cx, cy, radius, ctx, color, onlyStroke }) => {
  let x = radius - 1
  let y = 0
  let dx = 1
  let dy = 1
  let err = dx - (radius << 1)

  if (onlyStroke) {
    ctx.fillStyle = color
  } else {
    ctx.strokeStyle = color
  }

  const drawPixel = (x, y) => {
    ctx.fillRect(x, y, 1, 1)
  }

  const drawLine = ({ x0, x1, y }) => {
    ctx.beginPath()
    ctx.moveTo(x0 + 1, y + 0.5)
    ctx.lineTo(x1, y + 0.5)
    ctx.stroke()
  }

  while (x >= y) {
    if (onlyStroke) {
      drawPixel(cx + x, cy + y)
      drawPixel(cx - x, cy + y)
      drawPixel(cx + y, cy + x)
      drawPixel(cx - y, cy + x)
      drawPixel(cx + x, cy - y)
      drawPixel(cx - x, cy - y)
      drawPixel(cx + y, cy - x)
      drawPixel(cx - y, cy - x)
    } else {
      drawLine({ x0: cx + y, x1: cx - y, y: cy - x })
      drawLine({ x0: cx + x, x1: cx - x, y: cy - y })
      drawLine({ x0: cx + x, x1: cx - x, y: cy + y })
      drawLine({ x0: cx + y, x1: cx - y, y: cy + x })
    }

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

export default circle
