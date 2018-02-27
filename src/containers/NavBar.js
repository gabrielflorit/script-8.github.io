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
  // const items = [screenTypes.CODE, screenTypes.SFX, screenTypes.RUN]
  const items = [screenTypes.CODE, screenTypes.RUN]

  const lis = items.map((d, i) => (
    <li key={i}>
      <button
        onClick={() => {
          setScreen(d)
        }}
        className={classNames({ active: screen === d })}
      >
        {d}
      </button>
    </li>
  ))

  return <ul className='NavBar'>{lis}</ul>
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
