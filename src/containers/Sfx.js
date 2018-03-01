import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import _ from 'lodash'
import Updater from './Updater.js'
import Title from './Title.js'
import Menu from './Menu.js'
import NavBar from './NavBar.js'

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch, props) => ({})

const Sfx = () => (
  <div className='Sfx'>
    <Updater />
    <Title />
    <Menu />
    <NavBar />
    <div className='temp'>
      <ul className='bank'>
        {_.range(1, 9).map(d => (
          <li className={classNames({ active: d === 3 })} key={d}>
            {d}
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Sfx)
