import React from 'react'
import { connect } from 'react-redux'
import Oauth from './Oauth.js'
import Boot from '../components/Boot.js'
import Run from '../components/Run.js'
import actions, { fetchGist } from '../actions/actions.js'
import screenTypes from '../utils/screenTypes.js'
import '../css/App.css'

// window.handleCode = code => {
//   console.log({ code })
// }

const mapStateToProps = ({ screen, gist, booted }) => ({
  screen,
  gist,
  booted
})

const mapDispatchToProps = (dispatch, props) => ({
  setScreen: screen => dispatch(actions.setScreen(screen)),
  finishBoot: () => dispatch(actions.finishBoot()),
  fetchGist: id => dispatch(fetchGist(id))
})

const App = ({ screen, setScreen, gist, fetchGist, booted, finishBoot }) => {
  const { search } = window.location
  const params = new URLSearchParams(search)

  const options = {
    [screenTypes.OAUTH]: () => <Oauth />,
    [screenTypes.BOOT]: () => (
      <Boot
        setScreen={setScreen}
        fetchGist={fetchGist}
        finishBoot={finishBoot}
        gist={gist}
        booted={booted}
      />
    ),
    [screenTypes.RUN]: () => <Run />
  }

  const component = params.has('code')
    ? options[screenTypes.OAUTH]()
    : options[screen]()

  return <div className='App'>{component}</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
