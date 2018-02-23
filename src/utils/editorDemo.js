const demo = `
let radius = 1
let delta = 1

function update() {
  radius += delta
  if (radius >= 64) delta = -1
  if (radius <= 0) delta = 1
}

function draw() {
  clear()

  const loops = [...new Array(8)]
  loops.forEach((_, i) => {
    circFill(64, 64, radius - i * 7, i)
  })
}
`

export default demo
