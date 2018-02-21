import React from 'react'
import Terminal from './Terminal.js'
import Editor from './Editor.js'
import Run from './Run.js'
import Oauth from './Oauth.js'
import { Route } from 'react-router-dom'
import '../css/App.css'

const App = () => (
  <div className='App'>
    <Route exact path='/' component={Terminal} />
    <Route exact path='/editor' component={Editor} />
    <Route exact path='/run' component={Run} />
    <Route path='/oauth' component={Oauth} />
  </div>
)

export default App
