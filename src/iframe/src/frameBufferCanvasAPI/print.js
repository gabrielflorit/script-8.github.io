import alphabet from './alphabet.js'

const drawText = ({ x, y, letters, c, setPixel }) => {
  let currentX = Math.floor(x)
  let currentY = Math.floor(y)

  // Loop over every letter in the string to print.
  for (let letter of letters.toString().split('')) {
    // Lookup the pixels for the given letter.
    const pixels = alphabet[letter.toLowerCase()]
    // If we don't have any pixels, then treat this character as a space which
    // is 3 pixels wide and continue to the next character.
    if (!pixels) {
      currentX += 3 // Couldn't find a character
      continue
    }

    // Calculate the letter width by dividing the pixel count
    // by the standard letter height of 6.
    let letterWidth = pixels.length / 6

    // Loop over every pixel and draw it to the screen.
    for (let x = 0; x < letterWidth; x++) {
      for (let y = 0; y < 6; y++) {
        if (pixels[y * letterWidth + x]) {
          setPixel(currentX + x, currentY + y, c)
        }
      }
    }

    // Move on to the next character position by moving the previous character
    // width plus 1 for a slight space between characters.
    currentX += letterWidth + 1
  }
}

export default drawText
