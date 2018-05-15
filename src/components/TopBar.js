import React from 'react'
import PropTypes from 'prop-types'
import Updater from '../containers/Updater.js'
import Menu from '../containers/Menu.js'
import Title from '../containers/Title.js'
import NavBar from '../containers/NavBar.js'

const TopBar = ({ hideMenu }) => (
  <div className='TopBar'>
    <Updater />
    <Title />
    {hideMenu ? null : <Menu />}
    <NavBar />
  </div>
)

TopBar.propTypes = {
  hideMenu: PropTypes.bool
}

export default TopBar
