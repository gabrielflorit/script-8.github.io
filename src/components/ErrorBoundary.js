import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
  }

  render () {
    const { error, errorInfo } = this.state
    if (errorInfo) {
      // Error path
      return (
        <div className='ErrorBoundary'>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {error && error.toString()}
            <br />
            {errorInfo.componentStack}
          </details>
        </div>
      )
    }
    // Normally, just render children
    return this.props.children
  }
}

export default ErrorBoundary
