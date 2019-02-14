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
  updateGame: game => dispatch(actions.updateGame(game)),
  setScrollInfo: scrollInfo => dispatch(actions.setScrollInfo(scrollInfo)),
  updateHistory: ({ index, history }) =>
    dispatch(actions.updateHistory({ index, history }))
})

class Code extends Component {
  render () {
    const {
      game,
      updateGame,
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
        <div className='main'>
          <CodeEditor
            game={game}
            updateGame={updateGame}
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
