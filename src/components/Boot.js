import React, { Component } from 'react'
import PropTypes from 'prop-types'
import screenTypes from '../utils/screenTypes.js'

class Boot extends Component {
  componentDidMount () {
    const { search } = window.location
    const params = new URLSearchParams(search)
    const id = params.get('id')
    // If there's an id in the query string,
    if (id) {
      // try fetching the gist.
      this.props.fetchGist(id)

      // TODO
      // If we had an error fetching the gist id, say so,
      // and say that we're loading the default one in 3... 2... 1...
      // then load the default one,
      // and set the id on the query string.
    } else {
      // If there is no id,
      // load the default one,
      // and set the id on the query string.
      this.props.fetchGist('5e8973dbb5cfd1cb5559bb10bd95c127')
    }
  }

  componentDidUpdate () {
    const { gist, setScreen } = this.props

    // If we are done fetching, and we have a gist,
    if (!gist.isFetching && gist.data) {

      // update the query string,
      // (not necessary if the query string already contains the gist id),
      // and set the new screen.
      setScreen(screenTypes.RUN)
    }
  }

  render () {
    const { gist } = this.props
    return <div className='Boot'>gist is fetching: {!!gist.isFetching}</div>
  }
}

Boot.propTypes = {
  fetchGist: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  gist: PropTypes.object
}

export default Boot
