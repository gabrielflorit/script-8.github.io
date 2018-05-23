import React from 'react'
import PropTypes from 'prop-types'
import Updater from '../containers/Updater.js'
import Menu from '../containers/Menu.js'

const TopBar = ({ hideMenu }) => (
  <div className='TopBar'>
    <Updater />
    <Menu />
  </div>
)

TopBar.propTypes = {
  hideMenu: PropTypes.bool
}

export default TopBar
