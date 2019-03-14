import { assembleMiscLines } from '../../../reducers/game'
import runningSum from './runningSum'

const gameLineToTabLine = ({ game, gameLine }) => {
  // First convert the game to misc lines.
  const miscLines = assembleMiscLines(game)

  // Next, calculate the runningSum.
  const sum = runningSum(miscLines)

  // Then find our tab.
  const tab = sum.findIndex(pair => pair[1] > gameLine)

  // If no tab found, return null.
  return tab > -1
    ? {
        tab,
        tabLine: gameLine - sum[tab][0]
        // sum
      }
    : null
}

export default gameLineToTabLine
