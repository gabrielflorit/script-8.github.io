import React, { Component } from 'react'
import { connect } from 'react-redux'
import Updater from './Updater.js'
import Output from '../components/Output.js'
import screenTypes from '../utils/screenTypes.js'
import bios from '../utils/bios.js'
import actions, { fetchGist } from '../actions/actions.js'

const mapStateToProps = ({ gist, booted }) => ({
  gist,
  booted
})

const mapDispatchToProps = (dispatch, props) => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  finishBoot: () => dispatch(actions.finishBoot()),
  fetchGist: id => dispatch(fetchGist(id))
})

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
    const { finishBoot } = this.props
    return (
      <div className='Boot'>
        <Updater />
        <Output game={bios} run handleEnd={finishBoot} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Boot)
