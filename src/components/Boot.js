import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Boot extends Component {
  componentDidMount () {
    const { search } = window.location
    const params = new URLSearchParams(search)
    const id = params.get('id')
    // If there's an id in the query string,
    if (id) {
      // try fetching the gist.
      // we can now use this https://my-service-dqzpehqqcr.now.sh/243c5109c793bf09c052

      // If we had an error fetching the gist id, say so,
      // and say that we're loading the default one in 3... 2... 1...
      // then load the default one,
      // and set the id on the query string.
    } else {
      // If there is no id,
      // load the default one,
      // and set the id on the query string.
      console.log('none')
    }
  }

  render () {
    return <div className='Boot'>boot</div>
  }
}

Boot.propTypes = {
  fetchGist: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired
}

export default Boot
