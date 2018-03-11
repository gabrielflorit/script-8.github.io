import * as Tone from 'tone'
import toLetter from '../toLetter.js'
import normalizeVolume from '../normalizeVolume.js'
import defaultSfx from '../defaultSfx.js'

const pulse = {
  oscillator: {
    type: 'pulse'
  }
}

const createSynth = () => {
  const synth = new Tone.Synth(pulse).toMaster()
  return synth
}

const soundAPI = () => {
  const synth = createSynth()
  Tone.Transport.start()

  const sequencePool = []

  const playSfx = sfxs => number => {
    // Find the correct sfx.
    const sfx = sfxs[number]

    if (sfx) {
      const { notes, volumes } = {
        ...defaultSfx,
        ...sfx
      }

      // Stop all sequences.
      // TODO: pop and dispose sequence, so we don't end up with an array
      // of unused sequences.
      sequencePool.forEach(sequence => {
        sequence.stop()
      })

      // Create new sequence.
      const sequence = new Tone.Sequence(
        (time, event) => {
          const { note, volume } = event
          if (volume) {
            const letter = toLetter(note, true)
            synth.triggerAttackRelease(
              letter,
              '16n',
              time,
              normalizeVolume(volume)
            )
          }
        },
        notes.map((note, index) => ({ note, volume: volumes[index] })),
        '16n'
      )

      // Make sure it doesn't loop.
      sequence.loop = false

      // Start it,
      sequence.start()

      // and add it to the pool.
      sequencePool.push(sequence)
    }
  }

  return {
    playSfx
  }
}

export { createSynth }

export default soundAPI
