import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import throwError from '../utils/throwError.js'
import frecency from '../utils/frecency.js'
import actions, { setVisibility } from '../actions/actions.js'
import ShelfCassettes from '../components/ShelfCassettes.js'

const mapStateToProps = ({ gist, token, shelving }) => ({
  gist,
  token,
  shelving
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  setVisibility: ({ token, gistId, isPrivate }) =>
    dispatch(setVisibility({ token, gistId, isPrivate }))
})

class Shelf extends Component {
  constructor(props) {
    super(props)
    this.fetchCassettes = this.fetchCassettes.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleSetVisibility = this.handleSetVisibility.bind(this)
    this.state = {
      fetching: true,
      popularCassettes: [],
      recentCassettes: []
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.fetchCassettes()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchCassettes() {
    const { token } = this.props
    const currentLogin = _.get(token, 'user.login', null)

    if (token.value) {
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

          if (this._isMounted) {
            this.setState({
              yourPrivateCassettes,
              fetching: false
            })
          }
        })
    } else {
      if (this._isMounted) {
        this.setState({
          yourPrivateCassettes: []
        })
      }
    }

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

        if (this._isMounted) {
          this.setState({
            popularCassettes: popularCassettes.filter(d => !d.isFork),
            recentCassettes: recentCassettes.filter(d => !d.isFork),
            yourPublicCassettes,
            fetching: false
          })
        }
      })
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.shelving && !this.props.shelving) ||
      prevProps.token !== this.props.token
    ) {
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

  handleSetVisibility({ gistId, isPrivate }) {
    const { token, setVisibility } = this.props
    setVisibility({ token, gistId, isPrivate })
  }

  render() {
    const {
      popularCassettes,
      recentCassettes,
      yourPublicCassettes,
      yourPrivateCassettes,
      fetching
    } = this.state

    const tokenLogin = _.get(this.props, 'token.user.login', null)

    return (
      <div className="Shelf">
        <div className="main">
          {fetching ? (
            <p className="loading">loading cassettes...</p>
          ) : (
            <Fragment>
              {yourPrivateCassettes && yourPrivateCassettes.length ? (
                <ShelfCassettes
                  handleSetVisibility={this.handleSetVisibility}
                  tokenLogin={tokenLogin}
                  handleOnClick={this.handleOnClick}
                  cassettes={yourPrivateCassettes}
                  title="Your private cassettes"
                />
              ) : null}
              {yourPublicCassettes && yourPublicCassettes.length ? (
                <ShelfCassettes
                  handleSetVisibility={this.handleSetVisibility}
                  tokenLogin={tokenLogin}
                  handleOnClick={this.handleOnClick}
                  cassettes={yourPublicCassettes}
                  title="Your public cassettes"
                />
              ) : null}
              <ShelfCassettes
                handleSetVisibility={this.handleSetVisibility}
                tokenLogin={tokenLogin}
                handleOnClick={this.handleOnClick}
                cassettes={popularCassettes}
                title="Popular cassettes"
              />
              <ShelfCassettes
                handleSetVisibility={this.handleSetVisibility}
                tokenLogin={tokenLogin}
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
