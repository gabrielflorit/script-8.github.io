// Define arrow key helpers.
let keys = new Set()
const arrowUp = () => keys.has('ArrowUp')
const arrowRight = () => keys.has('ArrowRight')
const arrowDown = () => keys.has('ArrowDown')
const arrowLeft = () => keys.has('ArrowLeft')

// Keep track of what keys we're pressing.
document.addEventListener('keydown', e => {
  const keyName = event.key
  keys.add(keyName)
})

document.addEventListener('keyup', e => {
  const keyName = event.key
  keys.delete(keyName)
})