import _ from 'lodash'

const getScore = daysAgo => {
  if (daysAgo <= 4) {
    return 100
  } else if (daysAgo <= 14) {
    return 70
  } else if (daysAgo <= 31) {
    return 50
  } else if (daysAgo <= 90) {
    return 30
  } else {
    return 10
  }
}

const parseDate = str => {
  const mdy = str.split('-')
  return new Date(mdy[0], mdy[1] - 1, mdy[2])
}

const datediff = (first, second) =>
  Math.round((second - first) / (1000 * 60 * 60 * 24))

const frecency = (visits, date) => {
  const now = new Date()

  return _(visits)
    .map((value, key) => {
      const daysAgo = datediff(parseDate(key), date ? parseDate(date) : now)
      const score = getScore(daysAgo)
      return value * score
    })
    .sum()
}

export default frecency
