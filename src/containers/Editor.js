import React from 'react'
import { connect } from 'react-redux'
import CodeEditor from '../components/CodeEditor.js'
// import PropTypes from 'prop-types'
// import actions from './../actions/actions.js'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

const Editor = () => (
  <div className='Editor'>
    <CodeEditor />
  </div>
)

Editor.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
