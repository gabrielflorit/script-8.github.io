import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import screenTypes from '../iframe/src/utils/screenTypes.js'
import actions, { fetchGist, counterCassette } from '../actions/actions.js'

const mapStateToProps = ({ gist, booted, token }) => ({
  gist,
  booted,
  token
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  counterCassette: id => dispatch(counterCassette({ id })),
  fetchGist: ({ id, token }) => dispatch(fetchGist({ id, token }))
})

class Boot extends Component {
  componentDidMount() {
    const { fetchGist, token, setScreen } = this.props

    const { search } = window.location
    const params = new window.URLSearchParams(search)
    const id = params.get('id')
    // If there's an id in the query string,
    if (id) {
      // try fetching the gist.
      fetchGist({ id, token })
    } else {
      // If there is no id,
      // show home.
      setScreen(screenTypes.HOME)
    }
  }

  componentDidUpdate() {
    const { gist, setScreen, booted, counterCassette, token } = this.props

    // If we are done fetching, and we have a gist,
    // AND we are done booting,
    if (!gist.isFetching && gist.data && booted) {
      // set screen to RUN,
      setScreen(screenTypes.RUN)

      const tokenLogin = _.get(token, 'user.login', null)
      const gistLogin = _.get(gist, 'data.owner.login', null)
      if (tokenLogin !== gistLogin) {
        // and if this is not our cassette,
        // increment cassette hit counter.
        counterCassette(gist.data.id)
      }
    }
  }

  render() {
    return <div className="Boot" />
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Boot)
