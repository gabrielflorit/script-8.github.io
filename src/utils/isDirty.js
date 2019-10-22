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
import blankTemplate from '../iframe/src/blankTemplate.js'

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
  const gistGame = assembleOrderedGame(parseGistGame(gist.data))
  const thisGame = assembleOrderedGame(game)

  let gameIsDirty = false

  // If there is no game in the gist,
  if (gistGame === '') {
    // decide the game is dirty if it's not the blank template.
    gameIsDirty = !equal(blankTemplate, thisGame)
  } else {
    // If there is game in the gist,
    // then decide if it's dirty as per usual.
    gameIsDirty = !equal(gistGame, thisGame)
  }

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
