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

  const lis = items.map((d, i) => {
    const label =
      screen === screenTypes.RUN && d === screenTypes.CODE ? 'edit' : d
    return (
      <li key={i}>
        <button
          onClick={() => {
            setScreen(d === 'edit' ? screenTypes.CODE : d)
          }}
          className={classNames({ active: screen === d }, 'button')}
        >
          <span className='normal'>{label}</span>
          <abbr>{label.slice(0, 1)}</abbr>
        </button>
      </li>
    )
  })

  return <ul className='NavBar'>{lis}</ul>
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
