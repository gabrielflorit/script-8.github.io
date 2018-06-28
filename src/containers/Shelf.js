import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import throwError from '../utils/throwError.js'
import isDirty from '../utils/isDirty.js'
import isBlank from '../utils/isBlank.js'
import areYouSure from '../utils/areYouSure.js'

const mapStateToProps = ({ gist, game, sprites, phrases, chains, songs }) => ({
  gist,
  game,
  sprites,
  phrases,
  chains,
  songs
})

const mapDispatchToProps = dispatch => ({})

class Shelf extends Component {
  constructor (props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
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
            message: `Could not request cassettes via appspot service.`
          })
      )
      .then(cassettes => {
        this.setState({ cassettes, fetching: false })
      })
  }

  handleOnClick (id) {
    const { gist, game, sprites, phrases, chains, songs } = this.props
    const dirty = isDirty({ gist, game, sprites, phrases, chains, songs })
    const blank = isBlank({ game, sprites, phrases, chains, songs })
    if (!dirty || blank || areYouSure()) {
      window.location = `/?id=${id}`
    }
  }

  render () {
    const { cassettes, fetching } = this.state
    return (
      <div className='Shelf'>
        <div className='main'>
          <ul>
            {fetching ? <p>Loading latest cassettes.</p> : null}
            {_(cassettes)
              .sortBy(d => Date.parse(d.updated))
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
                    <div className='img'>
                      <a href={`/?id=${d.gist}`} target='_blank'>
                        <img
                          className='background'
                          alt=''
                          src='./cassette-bg.png'
                        />
                        {d.cover ? (
                          <img className='cover' src={d.cover} alt='' />
                        ) : null}
                        <span className='title'>{finalTitle}</span>
                        <span className='author'>by {d.user}</span>
                      </a>
                    </div>
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
