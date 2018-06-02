import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

const mapStateToProps = ({ gist, token, shelving }) => ({
  isFetching: gist.isFetching || token.isFetching || shelving
})

const mapDispatchToProps = () => ({})

const Title = ({ isFetching }) => (
  <div className={classNames('Title', { 'is-fetching': isFetching })}>
    script-8
  </div>
)

export default connect(mapStateToProps, mapDispatchToProps)(Title)
