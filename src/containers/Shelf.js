import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import throwError from '../utils/throwError.js'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({})

class Shelf extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: true,
      cassettes: []
    }
  }

  componentDidMount () {
    window
      .fetch(`${process.env.REACT_APP_NOW}/cassettes`)
      .then(
        response => response.json(),
        error =>
          throwError({
            error,
            message: `Could not request cassettes via now.sh service.`
          })
      )
      .then(cassettes => {
        this.setState({ cassettes, fetching: false })
      })
  }

  render () {
    const { cassettes, fetching } = this.state
    return (
      <div className='Shelf'>
        <div className='main'>
          <ul>
            {fetching ? <p>Loading latest cassettes.</p> : null}
            {_(cassettes)
              .sortBy('updated')
              .reverse()
              .map((d, i) => {
                const title = d.title || ''
                const maxLength = 16
                const tooLong = title.length > maxLength
                const finalTitle = [
                  title.substring(0, maxLength).trim(),
                  tooLong ? '…' : ''
                ].join('')

                return (
                  <li key={i}>
                    <div
                      className='img'
                      onClick={() => {
                        window.location = `/?id=${d.gist}`
                      }}
                    >
                      {d.cover ? <img src={d.cover} alt='' /> : null}
                    </div>
                    <p className='title'>{finalTitle}</p>
                    <p className='author'>by {d.user}</p>
                  </li>
                )
              })
              .value()}
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shelf)
