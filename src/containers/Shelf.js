import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import screenTypes from '../utils/screenTypes.js'
import throwError from '../utils/throwError.js'
import actions, { unshelve } from '../actions/actions.js'

const mapStateToProps = ({ gist, token, shelving }) => ({
  gist,
  token,
  shelving
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  unshelve: ({ token, gistId }) => dispatch(unshelve({ token, gistId }))
})

class Shelf extends Component {
  constructor (props) {
    super(props)
    this.fetchCassettes = this.fetchCassettes.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleOnUnshelve = this.handleOnUnshelve.bind(this)
    this.state = {
      fetching: true,
      cassettes: []
    }
  }

  componentDidMount () {
    this.fetchCassettes()
  }

  fetchCassettes () {
    window
      .fetch(`${process.env.REACT_APP_NOW}/cassettes`)
      .then(
        response => response.json(),
        error =>
          throwError({
            error,
            message: `Could not request cassettes.`
          })
      )
      .then(cassettes => {
        this.setState({ cassettes, fetching: false })
      })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.shelving && !this.props.shelving) {
      this.fetchCassettes()
    }
  }

  handleOnClick ({ e, id }) {
    const { gist, setScreen } = this.props
    if (id === _.get(gist, 'data.id')) {
      e.preventDefault()
      setScreen(screenTypes.RUN)
    }
  }

  handleOnUnshelve (gistId) {
    const { token, unshelve } = this.props
    unshelve({ token, gistId })
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

                const unshelve =
                  currentLogin === d.user ? (
                    <li>
                      <button
                        onClick={() => {
                          this.handleOnUnshelve(d.gist)
                        }}
                        className='button'
                      >
                        unshelve
                      </button>
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
                    <ul className='controls hide'>{unshelve}</ul>
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
