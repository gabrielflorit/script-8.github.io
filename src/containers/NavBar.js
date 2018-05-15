import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import screenTypes from '../utils/screenTypes.js'
import actions from '../actions/actions.js'

const mapStateToProps = ({ screen }) => ({
  screen
})

const mapDispatchToProps = dispatch => ({
  setScreen: screen => dispatch(actions.setScreen(screen))
})

const NavBar = ({ screen, setScreen }) => {
  let items = [screenTypes.CODE, screenTypes.RUN]

  if (screen !== screenTypes.RUN) {
    items.splice(0, 0, screenTypes.HELP)
    items.splice(
      2,
      0,
      screenTypes.SPRITE,
      screenTypes.SONG,
      screenTypes.CHAIN,
      screenTypes.PHRASE
    )
  }

  return items.map((d, i) => {
    const label =
      screen === screenTypes.RUN && d === screenTypes.CODE ? 'edit' : d

    return (
      <button
        key={i}
        onClick={() => {
          setScreen(d === 'edit' ? screenTypes.CODE : d)
        }}
        className={classNames({ active: screen === d }, 'button')}
      >
        {label}
      </button>
    )
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
