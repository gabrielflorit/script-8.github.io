let previousUserInput = {}

const allowedKeys = [
  'mousedown',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
  'a',
  'b',
  'Enter',
  ' '
]

const getUserInput = keys => {
  const { buttons } = window.navigator.getGamepads
    ? window.navigator.getGamepads()[0] || {}
    : {}

  let newUserInput = {
    __mousedown: keys.has('mousedown'),
    up: keys.has('ArrowUp') || (buttons && buttons[12].pressed),
    right: keys.has('ArrowRight') || (buttons && buttons[15].pressed),
    down: keys.has('ArrowDown') || (buttons && buttons[13].pressed),
    left: keys.has('ArrowLeft') || (buttons && buttons[14].pressed),
    a: keys.has('a') || (buttons && (buttons[1].pressed || buttons[2].pressed)),
    b: keys.has('b') || (buttons && (buttons[0].pressed || buttons[3].pressed)),
    start: keys.has('Enter') || (buttons && buttons[9].pressed),
    select: keys.has(' ') || (buttons && buttons[8].pressed)
  }

  for (const key of Object.keys(newUserInput)) {
    if (key.startsWith('__')) continue

    let keyPressed = !previousUserInput[key] && newUserInput[key]
    newUserInput[key + 'Pressed'] = keyPressed

    let keyReleased = previousUserInput[key] && !newUserInput[key]
    newUserInput[key + 'Released'] = keyReleased
  }

  previousUserInput = newUserInput

  return newUserInput
}

export { allowedKeys }

export default getUserInput
