import _ from 'lodash'
import runningSum from '../utils/runningSum.js'

const decorateTabCode = (tab, decorate) => {
  if (tab.mouseCodePosition && tab.text && decorate) {
    let node = tab.mouseCodePosition
    let before = tab.text.slice(0, node.start)
    let nodeCode = tab.text.slice(node.start, node.end)
    let after = tab.text.slice(node.end)
    return `${before}_script8.injectHighlight(() => ${nodeCode})${after}`
  }
  return tab.text
};

const assembleOrderedGame = (game, decorate = true) =>
  _(game)
    .orderBy((value, key) => key)
    .map(tab => decorateTabCode(tab, decorate))
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
