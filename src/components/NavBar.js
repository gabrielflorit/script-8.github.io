import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => (
  <ul className='NavBar'>
    <li>
      <NavLink exact activeClassName='active' to='/editor'>
        Editor
      </NavLink>
    </li>
    <li>
      <NavLink exact activeClassName='active' to='/run'>
        Run
      </NavLink>
    </li>
    <li>
      <NavLink exact activeClassName='active' to='/'>
        System
      </NavLink>
    </li>
  </ul>
)

export default NavBar
