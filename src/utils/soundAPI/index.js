import * as Tone from 'tone'
import range from 'lodash/range'
import settings from './settings.js'
const normalizeVolume = vol => vol / settings.volumes

const pulseOptions = {
  oscillator: {
    type: 'triangle'
  },
  envelope: {
    attack: 0.1,
    decay: 0.1,
    sustain: 0.1,
    release: 0.1
  }
}

const soundAPI = ({ sfxs }) => {
  const synth = new Tone.Synth(pulseOptions).toMaster()
  Tone.Transport.start()

  return {
    playSfx (number) {
      let sequence = new Tone.Sequence(
        (time, index) => {
          const note = sfxs[number].notes[index]
          const volume = sfxs[number].volumes[index]
          synth.triggerAttackRelease(note, '16n', time, normalizeVolume(volume))
        },
        range(16),
        '16n'
      )
      sequence.loop = 0
      sequence.start()
    }
  }
}

export default soundAPI
