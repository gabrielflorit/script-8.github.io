const demo = `
function update() {

}

function draw() {
  clear()

  const grid = [...new Array(128)]
  grid.forEach((_, i) => {
    if (i % 16 === 0) {
      strokeRect(64 - i/2 + 1, 64 - i/2 + 1, i - 1, i - 1, 0)
      strokeCirc(64, 64, i / 2 - 4, 0)
    }
  })

}
`

export default demo
