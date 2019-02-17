// TODO: implement scrollInfo per tab

import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
import actions from '../actions/actions.js'
import { getActive } from '../reducers/game.js'

const mapStateToProps = ({ game, tutorial, scrollInfo, docHistories }) => ({
  game,
  tutorial,
  scrollInfo,
  docHistories
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

  handleTabUpdates(content) {
    const tab = getActive(this.props.game).key
    this.props.updateGame({ tab, content })
  }

  render() {
    const {
      game,
      tutorial,
      scrollInfo,
      setScrollInfo,
      docHistories,
      updateHistory
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
