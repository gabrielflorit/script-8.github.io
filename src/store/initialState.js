import screenTypes from '../utils/screenTypes.js'
import blank from '../iframe/src/blank.js'

// TODO: why do we have to make game keys?
const initialState = {
  screen: screenTypes.BOOT,
  // screen: screenTypes.CODE,
  booted: false,
  gist: {},
  game: {
    0: {
      text: blank,
      active: true,
      key: 0
    }
  },
  token: {},
  nextAction: null,
  sfxs: [],
  sprites: {},
  map: [],
  phrases: {},
  chains: {},
  songs: {},
  docHistories: {},
  dismissedNotices: [],
  selectedUi: {
    phrase: 0,
    chain: 0,
    song: 0
  },
  // tutorial: {
  //   lessonIndex: 1,
  //   slideIndex: 0
  // },
  tutorial: null,
  sound: true,
  shelving: false
}

export default initialState
