import screenTypes from '../utils/screenTypes.js'
import blank from '../iframe/src/blank.js'

const initialState = {
  screen: screenTypes.BOOT,
  // screen: screenTypes.CODE,
  booted: false,
  gist: {},
  game: { 0: blank },
  token: {},
  nextAction: null,
  sfxs: [],
  sprites: {},
  map: [],
  phrases: {},
  chains: {},
  songs: {},
  scrollInfo: {},
  codeTab: 0,
  docHistories: {},
  // tutorial: {
  //   lessonIndex: 1,
  //   slideIndex: 0
  // },
  tutorial: null,
  sound: true,
  shelving: false
}

export default initialState
