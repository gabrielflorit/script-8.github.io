import React, { Component } from 'react'
import { connect } from 'react-redux'
import Updater from './Updater.js'
import Output from './Output.js'
import screenTypes from '../utils/screenTypes.js'
import actions, { fetchGist } from '../actions/actions.js'

const mapStateToProps = ({ gist, booted, token }) => ({
  gist,
  booted,
  token
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  fetchGist: ({ id, token }) => dispatch(fetchGist({ id, token }))
})

class Boot extends Component {
  componentDidMount () {
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
      // show shelf.
      setScreen(screenTypes.SHELF)
    }
  }

  componentDidUpdate () {
    const { gist, setScreen, booted } = this.props

    // If we are done fetching, and we have a gist,
    // AND we are done booting,
    if (!gist.isFetching && gist.data && booted) {
      // and set the new screen.
      setScreen(screenTypes.RUN)
    }
  }

  render () {
    return (
      <div className='Boot'>
        <Updater />
        <Output />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Boot)
