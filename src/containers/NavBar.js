import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import screenTypes from '../utils/screenTypes.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = (dispatch, props) => ({
  setScreen: screen => dispatch(actions.setScreen(screen))
})

const NavBar = ({ screen, setScreen }) => {
  let items = [screenTypes.CODE, screenTypes.RUN]

  if (screen !== screenTypes.RUN) {
    items.splice(1, screenTypes.SONG, screenTypes.CHAIN, screenTypes.PHRASE)
  }

  const lis = items.map((d, i) => (
    <li key={i}>
      <button
        onClick={() => {
          setScreen(d === 'edit' ? screenTypes.CODE : d)
        }}
        className={classNames({ active: screen === d }, 'button')}
      >
        {screen === screenTypes.RUN && d === screenTypes.CODE ? 'edit' : d}
      </button>
    </li>
  ))

  return <ul className='NavBar'>{lis}</ul>
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
