import React from 'react'
import Terminal from './Terminal.js'
import Editor from './Editor.js'
import { Route } from 'react-router-dom'
import '../css/App.css'

const App = () => (
  <div className='App'>
    <Route exact path='/' component={Terminal} />
    <Route path='/editor' component={Editor} />
  </div>
)

export default App
