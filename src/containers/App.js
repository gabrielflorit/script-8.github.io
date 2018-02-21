import React from 'react'
import { connect } from 'react-redux'
import Oauth from './Oauth.js'
import Boot from '../components/Boot.js'
import actions from '../actions/actions.js'
import '../css/App.css'

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = (dispatch, props) => ({
  setScreen: screen => dispatch(actions.setScreen(screen))
})

const App = ({ screen, setScreen, fetchGist }) => {
  console.log(screen)

  window.handleCode = code => {
    console.log({ code })
  }

  const { search } = window.location
  const params = new URLSearchParams(search)
  const component = params.has('code') ? (
    <Oauth />
  ) : (
    <Boot setScreen={setScreen} fetchGist={fetchGist} />
  )

  return <div className='App'>{component}</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
