import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import screenTypes from '../utils/screenTypes.js'
import throwError from '../utils/throwError.js'
import actions, { unshelve } from '../actions/actions.js'
import ShelfCassettes from '../components/ShelfCassettes.js'

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
      popularCassettes: [],
      recentCassettes: []
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
      .then(value => {
        const cassettes = value.map(cassette => ({
          ...cassette,
          counter: +cassette.counter || 0
        }))

        const popularCassettes = _(cassettes)
          .sortBy(cassette => +cassette.counter)
          .reverse()
          .value()

        const recentCassettes = _(cassettes)
          .sortBy(cassette => +cassette.updated)
          .reverse()
          .value()

        this.setState({
          popularCassettes,
          recentCassettes,
          fetching: false
        })
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
    const { popularCassettes, recentCassettes, fetching } = this.state
    // const { token } = this.props
    // const currentLogin = _.get(token, 'user.login', null)

    return (
      <div className='Shelf'>
        <div className='main'>
          {fetching ? (
            <p className='loading'>loading cassettes...</p>
          ) : (
            <Fragment>
              <ShelfCassettes
                handleOnClick={this.handleOnClick}
                cassettes={popularCassettes}
                title='Popular'
              />
              <ShelfCassettes
                handleOnClick={this.handleOnClick}
                cassettes={recentCassettes}
                title='Recent'
              />
            </Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shelf)
