import settings from './settings.js'
const normalize = {
  volume: vol => (vol + 1) / settings.volumes,
  note: note => note
}

export default normalize
