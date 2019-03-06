import equal from 'deep-equal'
import initialState from '../iframe/src/store/initialState.js'

const isBlank = ({ game, sprites, map, phrases, chains, songs }) =>
  equal(game, initialState.game) &&
  equal(sprites, initialState.sprites) &&
  equal(map, initialState.map) &&
  equal(phrases, initialState.phrases) &&
  equal(chains, initialState.chains) &&
  equal(songs, initialState.songs)

export default isBlank
