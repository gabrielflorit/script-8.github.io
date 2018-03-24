import settings from './settings.js'
const normalize = {
  volume: vol => vol / settings.volumes,
  note: note => note
}

export default normalize
