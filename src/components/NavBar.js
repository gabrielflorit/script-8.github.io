import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import screenTypes from '../utils/screenTypes.js'

const NavBar = ({ screen, setScreen }) => {
  const items = [screenTypes.CODE, screenTypes.SFX, screenTypes.RUN]

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

NavBar.propTypes = {
  screen: PropTypes.string,
  setScreen: PropTypes.func.isRequired
}

export default NavBar
