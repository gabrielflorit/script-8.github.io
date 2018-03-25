import * as Tone from 'tone'
import defaults from '../defaults.js'
import toLetter from '../toLetter.js'
import normalize from '../normalize.js'

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
  Tone.Transport.bpm.value = 60
  Tone.Transport.start()

  const sequencePool = []
  const playPhrase = phrases => number => {
    // Find the correct phrase.
    const phrase = phrases[number]
    if (phrase) {
      const { notes, volumes } = {
        ...defaults.phrase,
        ...phrase
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
          if (note !== null && volume > 0) {
            const letter = toLetter(note, true, true)
            synth.triggerAttackRelease(
              letter,
              '32n',
              time,
              normalize.volume(volume)
            )
          }
        },
        notes.map((note, index) => ({ note, volume: volumes[index] })),
        '32n'
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
    playPhrase
  }
}

export { createSynth }

export default soundAPI
