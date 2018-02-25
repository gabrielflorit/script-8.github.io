import React, { Component } from 'react'
import PropTypes from 'prop-types'
import screenTypes from '../utils/screenTypes.js'
import Output from './Output.js'
import Updater from './Updater.js'
import bios from '../utils/bios.js'

// TODO
// load default gist if url one fails to load

class Boot extends Component {
  componentDidMount () {
    const { fetchGist } = this.props
    const { search } = window.location
    const params = new window.URLSearchParams(search)
    const id = params.get('id')
    // If there's an id in the query string,
    if (id) {
      // try fetching the gist.
      fetchGist(id)
    } else {
      // If there is no id,
      // load the default one,
      // and set the id on the query string.
      fetchGist('2e0e10cfeaa108f1662e61a69609c8c1')
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
    const { finishBoot, gist } = this.props
    return (
      <div className='Boot'>
        <Updater gist={gist} />
        <div className='color-flash'>
          <Output game={bios} run handleEnd={finishBoot} />
        </div>
      </div>
    )
  }
}

Boot.propTypes = {
  fetchGist: PropTypes.func.isRequired,
  finishBoot: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  gist: PropTypes.object.isRequired,
  booted: PropTypes.bool.isRequired
}

export default Boot
