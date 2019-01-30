import React, { Component } from 'react'
import _ from 'lodash'

const STEP = 5

class ShelfCassettes extends Component {
  constructor (props) {
    super(props)
    this.renderCassette = this.renderCassette.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.state = {
      index: 0
    }
  }

  handleNext () {
    this.setState({
      index: this.state.index + STEP
    })
  }

  handlePrevious () {
    this.setState({
      index: Math.max(this.state.index - STEP, 0)
    })
  }

  renderCassette ({ cassette, i }) {
    const { handleOnClick } = this.props
    const title = cassette.title || ''
    const maxLength = 16
    const tooLong = title.length > maxLength
    const finalTitle = [
      title.substring(0, maxLength).trim(),
      tooLong ? '…' : ''
    ].join('')

    const date = new Date(cassette.updated)

    return (
      <li key={i} className='cassette'>
        <div className='img'>
          <span className='title'>{finalTitle || ' '}</span>
          <a
            href={`/?id=${cassette.gist}`}
            onClick={e => {
              handleOnClick({ e, id: cassette.gist })
            }}
            target='_blank'
          >
            <img className='background' alt='' src='./cassette-bg.png' />
            <span className='load'>load cassette</span>
            {cassette.cover ? (
              <img className='cover' src={cassette.cover} alt='' />
            ) : null}
          </a>
          <span className='author'>by {cassette.user}</span>
          <div className='date-info'>
            <span className='date'>{date.toLocaleDateString()}</span>
            <span className='booted'>ran: {cassette.counter || 0}</span>
          </div>{' '}
        </div>
        <ul className='controls hide'>unshelve</ul>
      </li>
    )
  }

  render () {
    const { cassettes, title } = this.props
    const { index } = this.state

    return (
      <div className='ShelfCassettes'>
        <div className='title-nav'>
          <span className='title'>{title}</span>
          <button
            disabled={index <= 0}
            className='button'
            onClick={this.handlePrevious}
          >
            &lt;
          </button>
          <button
            disabled={index >= cassettes.length - STEP}
            className='button'
            onClick={this.handleNext}
          >
            &gt;
          </button>
          <span className='count'>
            {index + 1} - {Math.min(index + STEP, cassettes.length)} (
            {cassettes.length} total)
          </span>
        </div>
        <ul className='cassettes'>
          {_(cassettes)
            .slice(index, index + STEP)
            .map((d, i) => this.renderCassette({ cassette: d, i }))
            .value()}
        </ul>
      </div>
    )
  }
}

export default ShelfCassettes
// const unshelve =
// currentLogin === cassette.user ? (
//   <li>
//     <button
//       onClick={() => {
//         this.handleOnUnshelve(cassette.gist)
//       }}
//       className='button'
//     >
//       unshelve
//     </button>
//   </li>
// ) : null
