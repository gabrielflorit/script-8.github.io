import equal from 'deep-equal'
import { parseGistGame } from '../reducers/game.js'
import { extractGistSprites } from '../reducers/sprites.js'
import { extractGistPhrases } from '../reducers/phrases.js'
import { extractGistChains } from '../reducers/chains.js'
import { extractGistSongs } from '../reducers/songs.js'

const isDirty = ({ gist, game, sprites, phrases, chains, songs }) => {
  const gistGame = parseGistGame(gist.data)
  const gistSprites = extractGistSprites(gist.data)
  const gistPhrases = extractGistPhrases(gist.data)
  const gistChains = extractGistChains(gist.data)
  const gistSongs = extractGistSongs(gist.data)
  const dirtyGame = !equal(gistGame, game)
  const dirtySprites = !equal(gistSprites, sprites)
  const dirtyPhrases = !equal(gistPhrases, phrases)
  const dirtyChains = !equal(gistChains, chains)
  const dirtySongs = !equal(gistSongs, songs)
  const dirty =
    dirtyGame || dirtyPhrases || dirtyChains || dirtySongs || dirtySprites

  return dirty
}

export default isDirty
