const demo = `

draw = function () {

  ctx.fillStyle = '#f6d6bd'
  ctx.strokeStyle = 'red'

  // const rows = [...new Array(127)]
  // const cols = [...new Array(127)]

  // rows.forEach((_, row) => {
  //   cols.forEach((_, col) => {
  //     if (row % 2 === 0 && col % 2 === 0) ctx.fillRect(col, row, 1, 1)
  //   })
  // })

  ctx.fillRect(0, 0, 60, 60)

  ctx.beginPath()
  ctx.strokeStyle = 'purple'
  ctx.lineWidth = 1
  ctx.arc(30, 30, 29, 0, Math.PI * 2)
  ctx.stroke()

}
`

export default demo
