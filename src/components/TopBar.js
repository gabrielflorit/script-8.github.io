import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Updater from '../containers/Updater.js'
import Menu from '../containers/Menu.js'

const TopBar = ({ hideMenu }) => (
  <div
    className={classNames('TopBar', {
      show: !hideMenu
    })}
  >
    <Updater />
    <Menu />
  </div>
)

TopBar.propTypes = {
  hideMenu: PropTypes.bool
}

export default TopBar
