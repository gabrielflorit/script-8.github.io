const drawCircle = ({ cx, cy, radius, color, onlyStroke, setPixel, line }) => {
  let x = radius - 1
  let y = 0
  let dx = 1
  let dy = 1
  let err = dx - (radius << 1)

  const drawLine = ({ x0, x1, y }) => {
    line(x0, y, x1, y, color)
  }

  if (radius === 2) {
    setPixel(cx + 1, cy, color)
    setPixel(cx - 1, cy, color)
    setPixel(cx, cy + 1, color)
    setPixel(cx, cy - 1, color)
    if (!onlyStroke) {
      setPixel(cx, cy, color)
    }
  } else if (radius === 3) {
    drawLine({ x0: cx - 2, x1: cx + 2, y: cy - 2 })
    drawLine({ x0: cx - 2, x1: cx + 2, y: cy + 2 })
    if (onlyStroke) {
      setPixel(cx + 2, cy - 1, color)
      setPixel(cx + 2, cy, color)
      setPixel(cx + 2, cy + 1, color)
      setPixel(cx - 2, cy - 1, color)
      setPixel(cx - 2, cy, color)
      setPixel(cx - 2, cy + 1, color)
    } else {
      drawLine({ x0: cx - 3, x1: cx + 3, y: cy - 1 })
      drawLine({ x0: cx - 3, x1: cx + 3, y: cy })
      drawLine({ x0: cx - 3, x1: cx + 3, y: cy + 1 })
    }
  } else {
    while (x >= y) {
      if (onlyStroke) {
        setPixel(cx + x, cy + y, color)
        setPixel(cx - x, cy + y, color)
        setPixel(cx + y, cy + x, color)
        setPixel(cx - y, cy + x, color)
        setPixel(cx + x, cy - y, color)
        setPixel(cx - x, cy - y, color)
        setPixel(cx + y, cy - x, color)
        setPixel(cx - y, cy - x, color)
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

export default drawCircle
