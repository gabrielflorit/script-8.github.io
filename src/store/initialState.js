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
    0: [
      '   2220 ',
      '   22222',
      '  20270 ',
      '  200220',
      '   2000 ',
      ' 221331 ',
      '0 333351',
      '  2   3 '
    ],
    1: [
      '00112112',
      '02225223',
      '12225225',
      '12223225',
      '13552112',
      '01121223',
      '12231225',
      '25532555'
    ]
  },
  rooms: {},
  phrases: {},
  chains: {},
  songs: {},
  tutorial: false,
  newUser: null,
  sound: false,
  shelving: false
}

export default initialState
