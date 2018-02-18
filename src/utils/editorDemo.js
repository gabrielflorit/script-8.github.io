const demo = `
function update() {

}

function draw() {
  clear()

  const grid = [...new Array(128)]
  grid.forEach((_, i) => {
    if (i % 32 === 0) {
      fillRect(64 - i/2 + 1, 64 - i/2 + 1, i - 1, i - 1, 4)
      fillCirc(64, 64, i / 2 - 4, 3)
    }
  })

  grid.forEach((_, i) => {
    if (i % 32 === 0) {
      strokeRect(64 - i/2 + 1, 64 - i/2 + 1, i - 1, i - 1, 2)
      strokeCirc(64, 64, i / 2 - 4, 0)
    }
  })

}
`

export default demo
