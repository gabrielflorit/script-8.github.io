import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Title = ({ isFetching }) => (
  <div className={classNames('Title', { 'is-fetching': isFetching })}>
    script-8
  </div>
)

Title.propTypes = {
  isFetching: PropTypes.bool
}

export default Title
