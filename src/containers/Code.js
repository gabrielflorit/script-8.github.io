import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({
  game,
  tutorial,
  scrollInfo,
  docHistories,
  codeTab
}) => ({
  game,
  tutorial,
  scrollInfo,
  docHistories,
  codeTab
})

const mapDispatchToProps = dispatch => ({
  updateGame: ({ tab, content }) =>
    dispatch(actions.updateGame({ tab, content })),
  setScrollInfo: scrollInfo => dispatch(actions.setScrollInfo(scrollInfo)),
  updateHistory: ({ index, history }) =>
    dispatch(actions.updateHistory({ index, history }))
})

class Code extends Component {
  constructor(props) {
    super(props)
    this.handleTabUpdates = this.handleTabUpdates.bind(this)
  }

  // When the codemirror content changes,
  handleTabUpdates({ tab, content }) {
    console.log({ tab, content })
    this.props.updateGame({ tab, content })

    // const {
    //   codeTabLines,
    //   game,
    //   updateGame,
    //   setCodeTabLines,
    //   codeTab
    // } = this.props

    // // get the number of lines in the editor
    // const contentLines = content.split('\n').length

    // // and use it to update the redux store's codeTabLines.
    // codeTabLines[codeTab] = contentLines
    // setCodeTabLines(codeTabLines)

    // // Then assemble the new overall game and save to store.
    // const updatedGame = [].join('\n')
    // updateGame(content)
  }

  render() {
    const {
      game,
      tutorial,
      scrollInfo,
      setScrollInfo,
      docHistories,
      updateHistory,
      codeTab
    } = this.props

    return (
      <div
        className={classNames('Code two-rows-and-grid', {
          tutorial: tutorial !== false
        })}
      >
        <div className="main">
          <CodeEditor
            game={game}
            updateContent={this.handleTabUpdates}
            scrollInfo={scrollInfo}
            setScrollInfo={setScrollInfo}
            docHistories={docHistories}
            codeTab={codeTab}
            updateHistory={updateHistory}
          />
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Code)
