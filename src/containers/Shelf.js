import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import TopBar from '../components/TopBar.js'
import throwError from '../utils/throwError.js'

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({})

class Shelf extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cassettes: []
    }
  }

  componentDidMount () {
    window
      .fetch('https://my-service-fvlfualcjz.now.sh/cassettes')
      .then(
        response => response.json(),
        error =>
          throwError({
            error,
            message: `Could not request cassettes via now.sh service.`
          })
      )
      .then(cassettes => {
        this.setState({ cassettes })
      })
  }

  render () {
    const { cassettes } = this.state
    return (
      <div className='Shelf two-rows'>
        <TopBar />
        <div className='main'>
          <ul>
            {_(cassettes)
              .sortBy('updated')
              .reverse()
              .map((d, i) => {
                return (
                  <li key={i}>
                    <div
                      className='img'
                      onClick={() => {
                        window.location = `/?id=${d.gist}`
                      }}
                    >
                      {d.cover ? <img src={d.cover} alt='' /> : null}
                    </div>
                  </li>
                )
              })
              .value()}
          </ul>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shelf)
