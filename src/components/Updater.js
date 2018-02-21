import { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash.get'

class Updater extends Component {
  componentDidMount () {
    const { gist, history } = this.props
    const id = get(gist, 'data.id')
    if (id) {
      this.updateHistory({ history, id })
    }
  }

  componentDidUpdate (prevProps) {
    const { gist, history } = this.props
    const oldId = get(prevProps, 'gist.data.id')
    const id = get(gist, 'data.id')
    if (id && id !== oldId) {
      this.updateHistory({ history, id })
    }
  }

  updateHistory({ history, id }) {
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
