import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import screenTypes from '../utils/screenTypes.js'
import throwError from '../utils/throwError.js'
import frecency from '../utils/frecency.js'
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
  constructor(props) {
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

  componentDidMount() {
    this.fetchCassettes()
  }

  fetchCassettes() {
    const { token } = this.props
    const currentLogin = _.get(token, 'user.login', null)

    window
      .fetch(`${process.env.REACT_APP_NOW}/private-cassettes`, {
        method: 'POST',
        body: JSON.stringify({
          token: token.value
        })
      })
      .then(
        response => response.json(),
        error =>
          throwError({
            error,
            message: `Could not request cassettes.`
          })
      )
      .then(value => {
        const yourPrivateCassettes = _(value)
          .sortBy(cassette => +cassette.updated)
          .reverse()
          .value()

        this.setState({
          yourPrivateCassettes,
          fetching: false
        })
      })

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
          .map(cassette => ({
            ...cassette,
            score: frecency(cassette.visits)
          }))
          .sortBy(cassette => cassette.score)
          .reverse()
          .value()

        const recentCassettes = _(cassettes)
          .sortBy(cassette => +cassette.updated)
          .reverse()
          .value()

        const yourPublicCassettes = currentLogin
          ? recentCassettes.filter(cassette => cassette.user === currentLogin)
          : []

        this.setState({
          popularCassettes: popularCassettes.filter(d => !d.isFork),
          recentCassettes: recentCassettes.filter(d => !d.isFork),
          yourPublicCassettes,
          fetching: false
        })
      })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shelving && !this.props.shelving) {
      this.fetchCassettes()
    }
  }

  handleOnClick({ e, id }) {
    const { gist, setScreen } = this.props
    if (id === _.get(gist, 'data.id')) {
      e.preventDefault()
      setScreen(screenTypes.RUN)
    }
  }

  handleOnUnshelve(gistId) {
    const { token, unshelve } = this.props
    unshelve({ token, gistId })
  }

  render() {
    const {
      popularCassettes,
      recentCassettes,
      yourPublicCassettes,
      yourPrivateCassettes,
      fetching
    } = this.state

    return (
      <div className="Shelf">
        <div className="main">
          {fetching ? (
            <p className="loading">loading cassettes...</p>
          ) : (
            <Fragment>
              {yourPrivateCassettes && yourPrivateCassettes.length ? (
                <ShelfCassettes
                  handleOnClick={this.handleOnClick}
                  cassettes={yourPrivateCassettes}
                  title="Your private cassettes"
                />
              ) : null}
              {yourPublicCassettes && yourPublicCassettes.length ? (
                <ShelfCassettes
                  handleOnClick={this.handleOnClick}
                  cassettes={yourPublicCassettes}
                  title="Your public cassettes"
                />
              ) : null}
              <ShelfCassettes
                handleOnClick={this.handleOnClick}
                cassettes={popularCassettes}
                title="Popular cassettes"
              />
              <ShelfCassettes
                handleOnClick={this.handleOnClick}
                cassettes={recentCassettes}
                title="Recent cassettes"
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
