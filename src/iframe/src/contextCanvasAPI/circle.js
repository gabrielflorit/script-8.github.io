const circle = ({ cx, cy, radius, ctx, color, onlyStroke }) => {
  let x = radius - 1
  let y = 0
  let dx = 1
  let dy = 1
  let err = dx - (radius << 1)

  ctx.fillStyle = color
  ctx.strokeStyle = color

  const drawPixel = (x, y) => {
    ctx.fillRect(x, y, 1, 1)
  }

  const drawLine = ({ x0, x1, y }) => {
    ctx.beginPath()
    ctx.moveTo(x0 + 1, y + 0.5)
    ctx.lineTo(x1, y + 0.5)
    ctx.stroke()
  }

  if (radius === 2) {
    drawPixel(cx + 1, cy)
    drawPixel(cx - 1, cy)
    drawPixel(cx, cy + 1)
    drawPixel(cx, cy - 1)
    if (!onlyStroke) {
      drawPixel(cx, cy)
    }
  } else if (radius === 3) {
    drawLine({ x0: cx - 2, x1: cx + 2, y: cy - 2 })
    drawLine({ x0: cx - 2, x1: cx + 2, y: cy + 2 })
    if (onlyStroke) {
      drawPixel(cx + 2, cy - 1)
      drawPixel(cx + 2, cy)
      drawPixel(cx + 2, cy + 1)
      drawPixel(cx - 2, cy - 1)
      drawPixel(cx - 2, cy)
      drawPixel(cx - 2, cy + 1)
    } else {
      drawLine({ x0: cx - 3, x1: cx + 3, y: cy - 1 })
      drawLine({ x0: cx - 3, x1: cx + 3, y: cy })
      drawLine({ x0: cx - 3, x1: cx + 3, y: cy + 1 })
    }
  } else {
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
}

export default circle
