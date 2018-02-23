const boot = `
function random(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

rectFill(0, 0, 128, 128, 7)

// first create the positions,
// then cycle coloring the pixels
)]
  .map(_ => [random(0, 64) * 2,random(0, 64) * 2].join(','))
))

console.log(rects.length)

let i = 0
function update() {
  i++
}

function draw() {
  if (i % 4 === 0) {
    rects.forEach(rect => {
      const [x, y] = rect.split(',')
      rectFill(x, y, 1, 1, random(5, 6))
    })
  }
}
`

export default boot

























// const rects = [...new Array(128 * 16)]
//   .map(_ => ({
//     x: random(0, 64) * 2,
//     y: random(0, 64) * 2
//   }))

// rects.forEach(r => {
//   rectFill(r.x, r.y, 1, 1, 6)
// })

// let rect = [0, 0]

// function draw() {
//   // if (i % 32 === 0) {
//     rectFill(rect[0], rect[1], 1, 1, 7)
//     rect = [random(0, 64) * 2, i]
//     rectFill(rect[0], rect[1], 1, 1, 0)
//   // }
