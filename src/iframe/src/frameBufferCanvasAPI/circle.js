const drawCircle = ({ cx, cy, radius, color, onlyStroke, setPixel, line }) => {
  let x = radius - 1
  let y = 0
  let dx = 1
  let dy = 1
  let err = dx - (radius << 1)

  // Draw the correct primitive at x offset from the center, and y above and below the center
  // If onlyStroke, then draw two points
  // otherwise, draw a line connecting the two points
  const drawReflectedPair = (x, y) => {
    if (onlyStroke) {
      setPixel(cx + x, cy + y, color)
      setPixel(cx + x, cy - y, color)
    } else {
      line(cx + x, cy + y, cx + x, cy - y, color)
    }
  }

  if (radius === 2) {
    // Draw Left Pixel
    drawReflectedPair(-1, 0)
    // Draw Top and Bottom Pixels
    drawReflectedPair(0, 1)
    // Draw Right Pixel
    drawReflectedPair(1, 0)
  } else if (radius === 3) {
    // Draw Left Edge
    drawReflectedPair(-2, 0)
    drawReflectedPair(-2, 1)
    // Draw Top and Bottom Edge
    drawReflectedPair(-1, 2)
    drawReflectedPair(-0, 2)
    drawReflectedPair(1, 2)
    // Draw Right Edge
    drawReflectedPair(2, 1)
    drawReflectedPair(2, 0)
  } else {
    while (x >= y) {
      // Draw every octant
      drawReflectedPair(x, y)
      drawReflectedPair(-x, y)
      drawReflectedPair(y, x)
      drawReflectedPair(-y, x)

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
