const screenTypes = {
  BOOT: 'BOOT',
  HOME: 'HOME',
  RUN: 'RUN',
  HELP: 'HELP',
  CODE: 'CODE',
  SPRITE: 'SPRITE',
  MAP: 'MAP',
  SONG: 'SONG',
  CHAIN: 'CHAIN',
  PHRASE: 'PHRASE',
  SHELF: 'SHELF'
}

const cycleOrder = [
  screenTypes.HOME,
  screenTypes.CODE,
  screenTypes.SPRITE,
  screenTypes.MAP,
  screenTypes.PHRASE,
  screenTypes.CHAIN,
  screenTypes.SONG,
  screenTypes.HELP,
  screenTypes.SHELF,
  screenTypes.RUN
]

const getNextScreen = screen => {
  const index = cycleOrder.indexOf(screen)
  return cycleOrder[(index + 1) % cycleOrder.length]
}

const getPreviousScreen = screen => {
  const index = cycleOrder.indexOf(screen)
  return cycleOrder[(index - 1 + cycleOrder.length) % cycleOrder.length]
}

export { getNextScreen, getPreviousScreen }

export default screenTypes
