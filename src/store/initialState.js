import _ from 'lodash'
import screenTypes from '../utils/screenTypes.js'
import blank from '../utils/blank.js'

const initialState = {
  // screen: screenTypes.CHAIN,
  // screen: screenTypes.PHRASE,
  // screen: screenTypes.SONG,
  // screen: screenTypes.BOOT,
  // screen: screenTypes.SHELF,
  screen: screenTypes.WORLD,
  booted: false,
  gist: {},
  game: blank,
  token: {},
  nextAction: null,
  sfxs: [],
  sprites: {
    '32': [
      '00112112',
      '02225223',
      '12225225',
      '12223225',
      '13552112',
      '01121223',
      '12231225',
      '25532555',
      1
    ],
    '33': [
      '11111114',
      '14444445',
      '14445445',
      '14545445',
      '54555455',
      '55522553',
      '15231525',
      '25532555',
      1
    ]
  },
  rooms: [],
  phrases: {},
  chains: {},
  songs: {},
  tutorial: false,
  newUser: null,
  sound: false,
  shelving: false
}

export default initialState
