import React from 'react'
import Output from './Output.js'
import NavBar from './NavBar.js'
import Title from './Title.js'
import Updater from './Updater.js'

const Run = () => (
  <div className='Run'>
    <Updater />
    <Title />
    <NavBar />
    <Output />
  </div>
)

export default Run
