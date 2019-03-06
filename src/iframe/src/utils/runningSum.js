const runningSum = array => {
  if (!array.length) array.push(0)
  return array.reduce((acc, cur, idx) => {
    if (idx > 0) {
      const previous = acc[idx - 1]
      return [...acc, [previous[1], previous[1] + cur]]
    } else {
      return [[0, cur]]
    }
  }, [])
}

export default runningSum
