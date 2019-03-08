import alphabet from './alphabet.js'

const drawText = ({ x, y, letters, c, setPixel, cameraX, cameraY }) => {
  let currentX = Math.floor(x)
  let currentY = Math.floor(y)

  for (let letter of letters.toString().split('')) {
    const pixels = alphabet[letter.toLowerCase()]
    if (!pixels) {
      currentX += 3 // Couldn't find a character
      continue
    }

    let letterWidth = pixels.length / 6;
    for (let x = 0; x < letterWidth; x++) {
      for (let y = 0; y < 6; y++) {
        if (pixels[y * letterWidth + x]) {
          setPixel(currentX + x, currentY + y, c)
        }
      }
    }
    currentX += letterWidth + 1
  }
}

export default drawText
