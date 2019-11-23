import _ from 'lodash'
import runningSum from '../utils/runningSum.js'

// This takes a tab and returns the code from that tab. It also looks at the call expression under the mouse (if one
// exists) and wraps it in the `_script8.injectHighlight` function to setup higlighting. Decorate is taken as an
// argument so that places which do not need decorated code can preserve the code as written by the user.
const decorateTabCode = (tab, decorate) => {
  if (tab.callUnderMouse && tab.text && decorate) {
    // Say the user has written the following code:
    //
    //     drawTitle = () => {
    //       print(64, 64, "Crazy Awesome Game!")
    //       return true
    //     }
    //
    //     if (drawTitle()) { ... do something ... }
    //         ^^^^^^^^^^^
    // With the mouse hovering over the drawTitle call. In this case, the `callUnderMouse` for the current tab would be
    // a callExpression node with a `callee` of the drawTitle Identifier, and an empty arguments list. We can hook into
    // this call by wrapping it in a lambda and passing it to a function which sets the highlight flag before and after
    // making the drawTitle call. In our case we have stored a special `injectHighlight` function in the _script8
    // global variable which is unaccessible by the user. The resulting code for that line looks like this:
    //
    //     if (_script8.injectHighlight(() => drawTitle())) { ... do something ... }
    //
    // Since `injectHighlight` stores and passes on the return value fom the lambda, the wrapped expression can be used
    // in any place the original expression was used. But we get the added benefit of knowing when the command started
    // and when it ended
    let node = tab.callUnderMouse
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
