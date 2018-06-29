import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import screenTypes from '../utils/screenTypes.js'
import throwError from '../utils/throwError.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ gist, token }) => ({
  gist,
  token
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen))
})

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

  handleOnClick ({ e, id }) {
    const { gist, setScreen } = this.props
    if (id === _.get(gist, 'data.id')) {
      e.preventDefault()
      setScreen(screenTypes.RUN)
    }
  }

  render () {
    const { cassettes, fetching } = this.state
    const { token } = this.props
    const currentLogin = _.get(token, 'user.login', null)

    return (
      <div className='Shelf'>
        <div className='main'>
          <ul className='cassettes'>
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

                const unpublish =
                  currentLogin === d.user ? (
                    <li>
                      <button className='button'>unpublish</button>
                    </li>
                  ) : null

                return (
                  <li key={i} className='cassette'>
                    <div className='img'>
                      <span className='title'>{finalTitle || ' '}</span>
                      <a
                        href={`/?id=${d.gist}`}
                        onClick={e => {
                          this.handleOnClick({ e, id: d.gist })
                        }}
                        target='_blank'
                      >
                        <img
                          className='background'
                          alt=''
                          src='./cassette-bg.png'
                        />
                        <span className='load'>load cassette</span>
                        {d.cover ? (
                          <img className='cover' src={d.cover} alt='' />
                        ) : null}
                      </a>
                      <span className='author'>by {d.user}</span>
                    </div>
                    <ul className='controls'>{unpublish}</ul>
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
