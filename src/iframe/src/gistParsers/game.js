import _ from 'lodash'
import runningSum from '../utils/runningSum.js'

const assembleOrderedGame = game =>
  _(game)
    .orderBy((value, key) => key)
    .map('text')
    .filter(d => !_.isEmpty(d))
    .value()
    .join('\n')

const parseGistGame = data => {
  const misc = JSON.parse(_.get(data, 'files["misc.json"].content', '{}'))
  const content = _.get(data, 'files["code.js"].content', '')
  if (misc.lines) {
    const ranges = runningSum(misc.lines)
    const contentLines = content.split('\n')
    return ranges.reduce(
      (acc, cur, idx) => ({
        ...acc,
        [idx]: {
          text: contentLines.slice(...cur).join('\n'),
          active: idx === 0,
          key: idx
        }
      }),
      {}
    )
  } else {
    return {
      0: {
        text: content,
        active: true,
        key: 0
      }
    }
  }
}

export { parseGistGame, assembleOrderedGame }
