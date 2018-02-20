import React from 'react'
import { NavLink } from "react-router-dom"

const Menu = () => (
  <ul className='Menu'>
    <li><NavLink exact activeClassName='active' to='/'>System</NavLink></li>
    <li><NavLink exact activeClassName='active' to='/editor'>Editor</NavLink></li>
    <li><NavLink exact activeClassName='active' to='/run'>Run</NavLink></li>
  </ul>
)

export default Menu
