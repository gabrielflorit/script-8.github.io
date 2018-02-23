import React, { Component } from 'react'
import PropTypes from 'prop-types'
import screenTypes from '../utils/screenTypes.js'
import Output from './Output.js'
import boot from '../utils/boot.js'

// TODO
// implement boot sequence
// load default gist if url one fails to load

class Boot extends Component {
  componentDidMount () {
    // const { fetchGist, finishBoot } = this.props
    // // Start the boot sequence,
    // // and after N seconds,
    // // fire a FINISH_BOOT action
    // setTimeout(finishBoot, 5000)
    // const { search } = window.location
    // const params = new URLSearchParams(search)
    // const id = params.get('id')
    // // If there's an id in the query string,
    // if (id) {
    //   // try fetching the gist.
    //   fetchGist(id)
    // } else {
    //   // If there is no id,
    //   // load the default one,
    //   // and set the id on the query string.
    //   fetchGist('5e8973dbb5cfd1cb5559bb10bd95c127')
    // }
  }

  componentDidUpdate () {
    const { gist, setScreen, booted } = this.props

    // If we are done fetching, and we have a gist,
    // AND we are done booting,
    if (!gist.isFetching && gist.data && booted) {
      const { search } = window.location
      const params = new window.URLSearchParams(search)
      const id = params.get('id')

      // update the query string (if we have a new one),
      if (id !== gist.id) {
        window.history.pushState(null, null, `/?id=${gist.data.id}`)
      }

      // and set the new screen.
      setScreen(screenTypes.RUN)
    }
  }

  render () {
    return (
      <div className='Boot'>
        <div className='color-flash'>
          <Output game={boot} run />
        </div>
      </div>
    )
  }
}

Boot.propTypes = {
  fetchGist: PropTypes.func.isRequired,
  finishBoot: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  gist: PropTypes.object,
  booted: PropTypes.bool.isRequired
}

export default Boot