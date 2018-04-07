import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'

const mapStateToProps = ({ tutorial }) => ({ tutorial })

const mapDispatchToProps = dispatch => ({
  closeTutorial: () => dispatch(actions.closeTutorial()),
  nextTutorialSlide: () => dispatch(actions.nextTutorialSlide())
})

class Tutorial extends Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleNextSlide = this.handleNextSlide.bind(this)
  }

  handleClose () {
    this.props.closeTutorial()
  }

  handleNextSlide () {
    this.props.nextTutorialSlide()
  }

  componentDidMount () {}

  render () {
    const { tutorial } = this.props
    return (
      <div className={`Tutorial slide-${tutorial}`}>
        <div className={classNames({ hide: tutorial !== 0 })}>
          <div>?NEW_USER</div>
          <div>Load tutorial:</div>
          <div>
            >
            <button className='button' onClick={this.handleNextSlide}>
              YES
            </button>
            <button className='button' onClick={this.handleClose}>
              NO
            </button>
          </div>
        </div>

        <div className={classNames({ hide: tutorial !== 1 })}>
          <div>first slide</div>
          <div>
            >
            <button className='button' onClick={this.handleNextSlide}>
              next
            </button>
            <button className='button' onClick={this.handleClose}>
              close
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial)
