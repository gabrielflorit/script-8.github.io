import React, { Component } from 'react'
import _ from 'lodash'
import timeAgo from '../utils/timeAgo.js'

/*
- Add LOAD to bottom of comments

*/

const DEFAULT_COMMENT = 'Insert your comment here.'

const isCommentValid = value =>
  value && value.length && value !== DEFAULT_COMMENT

class Comments extends Component {
  constructor(props) {
    super(props)

    this.deleteComment = this.deleteComment.bind(this)
    this.createIssueAndComment = this.createIssueAndComment.bind(this)
    this.fetchIssueAndComments = this.fetchIssueAndComments.bind(this)
    this.updateUserScopes = this.updateUserScopes.bind(this)
    this.createComment = this.createComment.bind(this)
    this.handleCommentCreate = this.handleCommentCreate.bind(this)
    this.handleCommentDelete = this.handleCommentDelete.bind(this)
    this.handleCommentChange = this.handleCommentChange.bind(this)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.state = {
      commentTextarea: DEFAULT_COMMENT,
      comments: [],
      issue: null,
      error: null,
      isFetching: false,
      scopes: ''
    }
  }

  async updateUserScopes() {
    const { token } = this.props
    const currentLogin = _.get(token, 'user.login', null)

    if (currentLogin) {
      const url = `https://api.github.com/users/${currentLogin}`
      console.log(`updateUserScopes: fetch ${url}`)
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.headers.has('x-oauth-scopes')) {
        this.setState({ scopes: response.headers.get('x-oauth-scopes') })
      }
    }
  }

  async fetchIssueAndComments() {
    const { gameId } = this.props

    // Fetch this game's issue.
    const issueSearchUrl = `https://api.github.com/search/issues?q=${gameId}+repo:script8/script8.github.io`
    console.log(`componentDidMount: fetch ${issueSearchUrl}.`)
    const issueResponse = await fetch(issueSearchUrl)

    // Extract the comments url from the issue.
    const issueJson = await issueResponse.json()
    const issue = _.get(issueJson, 'items[0]', null)
    const commentsUrl = _.get(issueJson, 'items[0].comments_url', null)

    if (issue && commentsUrl) {
      // If we found an issue, set it on state, fetch its comments and set them on state.
      this.setState({ issue })

      console.log(`componentDidMount: fetch ${commentsUrl}.`)
      const commentsResponse = await fetch(commentsUrl)
      const commentsJson = await commentsResponse.json()
      this.setState({ comments: commentsJson })
    }

    this.updateUserScopes()
  }

  componentDidMount() {
    this.fetchIssueAndComments()
  }

  async createIssueAndComment() {
    await this.createIssue()
    await this.createComment()
  }

  async createIssue() {
    const { token, gameId } = this.props

    this.setState({
      isFetching: true
    })

    // Create an issue.
    const url = `https://api.github.com/repos/script8/script8.github.io/issues`
    const options = {
      method: 'POST',
      headers: {
        Authorization: `token ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: gameId })
    }

    console.log(`createIssue: fetching ${url}`)
    const response = await fetch(url, options)
    if (response.status === 201) {
      const json = await response.json()
      this.setState({
        issue: json,
        isFetching: false
      })
    } else {
      this.setState({
        isFetching: false
      })
      throw new Error(response.statusText)
    }
  }

  async createComment() {
    const { token } = this.props
    const { issue, commentTextarea } = this.state

    this.setState({
      isFetching: true
    })

    const url = `https://api.github.com/repos/script8/script8.github.io/issues/${issue.number}/comments`
    const options = {
      method: 'POST',
      headers: {
        Authorization: `token ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: commentTextarea })
    }

    // POST the commentTextarea to this issue.
    console.log(`createComment: fetch ${url}`)
    const response = await fetch(url, options)
    // If we got a 201 status, which means CREATED,
    if (response.status === 201) {
      // parse the response,
      const json = await response.json()
      // then add the new comment to the bottom of our existing comments,
      // reset the comment textarea,
      // and also reset isFetching.
      this.setState({
        isFetching: false,
        comments: [...this.state.comments, json],
        commentTextarea: DEFAULT_COMMENT
      })
    } else {
      // If we didn't get a 201, something else happened.
      // Throw an error so we can handle it elsewhere.
      throw new Error(response.statusText)
    }
  }

  async deleteComment(commentId) {
    const { token } = this.props

    this.setState({
      isFetching: true
    })

    const url = `https://api.github.com/repos/script8/script8.github.io/issues/comments/${commentId}`
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `token ${token.value}`
      }
    }

    console.log(`handleCommentDelete: fetch ${url}`)
    const response = await fetch(url, options)
    if (response.status === 204) {
      this.setState({
        isFetching: false,
        comments: this.state.comments.filter(
          comment => comment.id !== commentId
        )
      })
    } else {
      this.setState({
        isFetching: false,
        error: response.statusText
      })
    }
  }

  handleCommentDelete(commentId) {
    this.deleteComment(commentId)
  }

  handleCommentCreate() {
    const { issue, commentTextarea, isFetching } = this.state

    console.log({ commentTextarea, isFetching, issue })

    // If we have an valid comment and we're not fetching:
    if (!isFetching && isCommentValid(commentTextarea)) {
      // If we don't have an issue, first create it.
      if (!issue) {
        try {
          console.log('creating issue and comment')
          this.createIssueAndComment()
        } catch (e) {
          this.setState({ isFetching: false, error: e.message })
        }
      } else {
        try {
          console.log('creating comment')
          this.createComment()
        } catch (e) {
          this.setState({ isFetching: false, error: e.message })
        }
      }
    }
  }

  handleCommentChange(e) {
    this.setState({ commentTextarea: e.target.value, error: null })
  }

  handleLoginClick() {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=gist public_repo`,
      'popup',
      'width=600,height=700'
    )
  }

  componentDidUpdate(prevProps) {
    const { token: oldToken } = prevProps
    const { token } = this.props

    if (oldToken.value !== token.value) {
      this.updateUserScopes()
    }
  }

  render() {
    const { token } = this.props
    const { commentTextarea, comments, isFetching, error, scopes } = this.state
    const now = new Date()

    const currentLogin = _.get(token, 'user.login', null)
    const disableAddCommentButton =
      isFetching || !isCommentValid(commentTextarea)

    const userHasCorrectScopes = scopes.includes('public_repo')

    // User can comment only if there is a login, and it has the right scopes.
    const userCanComment = !!currentLogin && userHasCorrectScopes

    return (
      <div className="Comments">
        <ul>
          {comments.map((comment, i) => (
            <li key={i}>
              <div className="info">
                <span className="user">{comment.user.login}</span>
                <span className="time">
                  {timeAgo({ now, before: new Date(comment.updated_at) })}
                </span>
                {currentLogin && currentLogin === comment.user.login && (
                  <button
                    className="button delete"
                    onClick={() => {
                      this.handleCommentDelete(comment.id)
                    }}
                  >
                    > delete
                  </button>
                )}
              </div>
              <div className="comment">{comment.body}</div>
            </li>
          ))}
        </ul>
        {userCanComment && (
          <div className="comment-box">
            <textarea
              value={commentTextarea}
              onChange={this.handleCommentChange}
            ></textarea>
            <button
              className="button"
              disabled={disableAddCommentButton}
              onClick={this.handleCommentCreate}
            >
              > Add comment
            </button>
            {error && <div className="error">Error: {error}</div>}
          </div>
        )}
        {!userCanComment && (
          <div className="comment-login-prompt">
            <button className="button" onClick={this.handleLoginClick}>
              >{' '}
              {currentLogin && !userHasCorrectScopes
                ? 'please login again to comment'
                : 'login to comment'}
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default Comments
