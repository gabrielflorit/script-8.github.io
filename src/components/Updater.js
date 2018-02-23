import { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class Updater extends Component {
  componentDidMount () {
    const { gist, history } = this.props
    const id = _.get(gist, 'data.id')
    if (id) {
      this.updateHistory({ history, id })
    }
  }

  componentDidUpdate (prevProps) {
    const { gist, history } = this.props
    const oldId = _.get(prevProps, 'gist.data.id')
    const id = _.get(gist, 'data.id')
    if (id && id !== oldId) {
      this.updateHistory({ history, id })
    }
  }

  updateHistory ({ history, id }) {
    history.push({
      search: `?id=${id}`
    })
  }

  render () {
    return null
  }
}

Updater.propTypes = {
  gist: PropTypes.object
}

export default Updater
