import range from 'lodash/range'
import settings from './settings.js'

const defaultSfx = {
  notes: range(16).map(d => 0),
  volumes: range(16).map(d => settings.volumes)
}

export default defaultSfx
