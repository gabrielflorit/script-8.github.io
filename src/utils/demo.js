const demo = `let radius = 1
let delta = 1

update = () => {
  radius += delta
  if (radius >= 64 || radius <= 0) delta = -delta
}

draw = () => {
  clear()
  rectFill(0, 0, 128, 128, 6)

  range(8).forEach(i => {
    circFill(64, 64, radius - i * 7, i)
  })
}`

export default demo
