import { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

const mapStateToProps = ({ gist }) => ({
  gist
})

const mapDispatchToProps = () => ({})

class Updater extends Component {
  componentDidMount () {
    // on component mount,
    // if we have an id in the gist,
    // make sure the url reflects this
    const { gist } = this.props
    const gistId = _.get(gist, 'data.id')

    const { search } = window.location
    const params = new window.URLSearchParams(search)
    const urlId = params.get('id')

    if (urlId || gistId) {
      // id from URL wins every time over persisted cassette
      this.updateUrl(urlId? urlId: gistId)
    }
  }

  componentDidUpdate (prevProps) {
    // when we get new props,
    // if the previous gist id is different than this one,
    // update url!
    const { gist } = this.props
    const oldId = _.get(prevProps, 'gist.data.id')
    const newId = _.get(gist, 'data.id')
    if (newId !== oldId) {
      this.updateUrl(newId)
    }
  }

  updateUrl (newId) {
    const { search } = window.location
    const params = new window.URLSearchParams(search)
    const urlId = params.get('id')
    if (urlId !== newId) {
      window.history.pushState(null, null, newId ? `/?id=${newId}` : '/')
    }
  }

  render () {
    return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Updater)
