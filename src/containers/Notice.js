import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import actions from '../actions/actions.js'
import notices from '../utils/notices.json'

const mapStateToProps = ({ dismissedNotices }) => ({ dismissedNotices })

const mapDispatchToProps = dispatch => ({
  dismissNotices: id => dispatch(actions.dismissNotices(id))
})

class Notice extends Component {
  constructor(props) {
    super(props)

    this.handleDismissNotices = this.handleDismissNotices.bind(this)
  }

  handleDismissNotices() {
    this.props.dismissNotices(notices.map(d => d.id))
  }

  render() {
    const newNoticeIds = _.difference(
      notices.map(d => d.id),
      this.props.dismissedNotices
    )

    return (
      <div className="Notice">
        <div className="box">
          <div className="text">
            <p className="title">SCRIPT-8 updates</p>
            {_(newNoticeIds)
              .map(id => notices.find(d => d.id === id))
              .sortBy('id')
              .reverse()
              .map((notice, i) => (
                <p key={i}>
                  <span>{notice.date} - </span>
                  {notice.text}
                </p>
              ))
              .value()}
          </div>
          <button className="button" onClick={this.handleDismissNotices}>
            > OK
          </button>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notice)
