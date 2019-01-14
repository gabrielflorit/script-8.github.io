import equal from 'deep-equal'
import { parseGistGame } from '../reducers/game.js'
import { extractGistMap } from '../reducers/map.js'
import { extractGistSprites } from '../reducers/sprites.js'
import { extractGistPhrases } from '../reducers/phrases.js'
import { extractGistChains } from '../reducers/chains.js'
import { extractGistSongs } from '../reducers/songs.js'

const isDirty = ({ gist, game, sprites, map, phrases, chains, songs }) => {
  const gameIsDirty = !equal(parseGistGame(gist.data), game)
  const mapIsDirty = !equal(extractGistMap(gist.data), map)
  const spritesIsDirty = !equal(extractGistSprites(gist.data), sprites)
  const phrasesIsDirty = !equal(extractGistPhrases(gist.data), phrases)
  const chainsIsDirty = !equal(extractGistChains(gist.data), chains)
  const songsIsDirty = !equal(extractGistSongs(gist.data), songs)

  // console.log({ old: parseGistGame(gist.data), newer: game })

  // console.log({
  //   gameIsDirty,
  //   mapIsDirty,
  //   spritesIsDirty,
  //   phrasesIsDirty,
  //   chainsIsDirty,
  //   songsIsDirty
  // })

  return (
    gameIsDirty ||
    mapIsDirty ||
    spritesIsDirty ||
    phrasesIsDirty ||
    chainsIsDirty ||
    songsIsDirty
  )
}

export default isDirty
