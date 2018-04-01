function getOffset (event) {
  let normalizedOffset
  if (isMouseDown) {
    const rect = event.target.getBoundingClientRect()
    const { width, height } = rect
    let offset
    if ('offsetX' in event) {
      offset = [event.offsetX, event.offsetY]
    } else {
      offset = [event.clientX - rect.left, event.clientY - rect.top]
    }
    normalizedOffset = [offset[0] * size / width, offset[1] * size / height]
  }
  return normalizedOffset
}

let isMouseDown = false
document.addEventListener('mousedown', e => {
  isMouseDown = true
})

document.addEventListener('mouseup', e => {
  isMouseDown = false
})

window.getOffset = getOffset
geval(`
      document.querySelector('canvas').onmousemove = e => {
        if (window.onMouseMove) {
          const offset = window.getOffset(e)
          if (offset) {
            window.onMouseMove(offset)
          }
        }
      };
    `)
