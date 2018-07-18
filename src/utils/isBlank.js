import equal from 'deep-equal'
import initialState from '../store/initialState.js'

const isBlank = ({ game, sprites, rooms, phrases, chains, songs }) =>
  equal(game, initialState.game) &&
  equal(sprites, initialState.sprites) &&
  equal(rooms, initialState.rooms) &&
  equal(phrases, initialState.phrases) &&
  equal(chains, initialState.chains) &&
  equal(songs, initialState.songs)

export default isBlank
