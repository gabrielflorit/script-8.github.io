const demo = `const drawCar = ({ car, g, getCoords }) => {
  const data = [car].map(d => getCoords({ pct: d.measures.slice(-1)[0].pct }))

  const triangles = g.selectAll('path.car').data(data)

  triangles
    .enter()
    .append('path')
    .attr('class', 'car')
    .attr('d', d =>
      d3
        .symbol()
        .type(d3.symbolTriangle)
        .size(100)()
    )
    .merge(triangles)

  triangles.exit().remove()
}

export default drawCar
`

export default demo