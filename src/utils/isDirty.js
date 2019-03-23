import equal from 'deep-equal'
import { extractGistMap } from '../iframe/src/gistParsers/map.js'
import { extractGistSprites } from '../iframe/src/gistParsers/sprites.js'
import { extractGistPhrases } from '../iframe/src/gistParsers/phrases.js'
import { extractGistChains } from '../iframe/src/gistParsers/chains.js'
import { extractGistSongs } from '../iframe/src/gistParsers/songs.js'
import { parseGistIframeVersion } from '../iframe/src/gistParsers/iframeVersion.js'
import {
  parseGistGame,
  assembleOrderedGame
} from '../iframe/src/gistParsers/game.js'

const isDirty = ({
  gist,
  game,
  sprites,
  map,
  phrases,
  chains,
  songs,
  iframeVersion
}) => {
  const gameIsDirty = !equal(
    assembleOrderedGame(parseGistGame(gist.data)),
    assembleOrderedGame(game)
  )
  const mapIsDirty = !equal(extractGistMap(gist.data), map)
  const spritesIsDirty = !equal(extractGistSprites(gist.data), sprites)
  const phrasesIsDirty = !equal(extractGistPhrases(gist.data), phrases)
  const chainsIsDirty = !equal(extractGistChains(gist.data), chains)
  const songsIsDirty = !equal(extractGistSongs(gist.data), songs)
  const iframeVersionIsDirty = !equal(
    parseGistIframeVersion(gist.data),
    iframeVersion
  )

  // console.log({
  //   old: assembleOrderedGame(parseGistGame(gist.data)),
  //   newer: assembleOrderedGame(game)
  // })
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
    songsIsDirty ||
    iframeVersionIsDirty
  )
}

export default isDirty
