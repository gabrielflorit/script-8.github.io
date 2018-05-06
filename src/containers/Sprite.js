import React, { Component } from 'react'
import { connect } from 'react-redux'
// import _ from 'lodash'
// import classNames from 'classnames'
import Output from './Output.js'
import actions from '../actions/actions.js'
import TopBar from '../components/TopBar.js'

const mapStateToProps = ({ sprites }) => ({ sprites })

const mapDispatchToProps = dispatch => ({
  updateSprite: ({ sprite, index }) =>
    dispatch(
      actions.updateSprite({
        sprite,
        index
      })
    )
})

class Sprite extends Component {
  // constructor (props) {
  //   super(props)
  // }

  render () {
    return (
      <div className='Sprite two-rows two-rows-and-grid'>
        <TopBar />
        <div className='main'>
          <div className='SpriteEditor'>sprite editor</div>
          <Output />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sprite)
