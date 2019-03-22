import screenTypes from '../utils/screenTypes.js'
import blank from '../blank.js'
import { version } from '../../package.json'

// TODO: why do we have to make game keys?
const initialState = {
  iframeVersion: version,
  errorLine: null,
  screen: screenTypes.BOOT,
  // screen: screenTypes.HOME,
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
