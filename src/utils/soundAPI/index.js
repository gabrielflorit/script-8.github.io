import * as Tone from 'tone'
import dropRightWhile from 'lodash/dropRightWhile'
import range from 'lodash/range'
import get from 'lodash/get'
import toLetter from '../toLetter.js'
import normalize from '../normalize.js'
import settings from '../settings.js'

const pulse = {
  oscillator: {
    type: 'pulse'
  }
}

const createSynth = () => {
  const synth = new Tone.Synth(pulse).toMaster()
  return synth
}

const playNote = ({ note, octave, volume, time, synth }) => {
  const letter = toLetter(note + octave * 12, true, true)
  synth.triggerAttackRelease(
    letter,
    '32n',
    time || window.AudioContext.currentTime,
    normalize.volume(volume)
  )
}

const soundAPI = () => {
  const synths = range(settings.chainChannels).map(() => createSynth())
  Tone.Transport.bpm.value = 60
  Tone.Transport.start()

  const songSequencePool = []

  const playSong = ({ songs, chains, phrases }) => (number, loop = false) => {
    const song = dropRightWhile(songs[number], d => d === null)
    if (song) {
      // Stop all sequences.
      // TODO: pop and dispose sequence, so we don't end up with an array
      // of unused sequences.
      songSequencePool.forEach(sequence => {
        sequence.stop()
      })
      const sequence = new Tone.Sequence(
        (time, index) => {
          const [chainPosition, phrasePosition, notePosition] = [
            '00',
            index.toString(settings.matrixLength)
          ]
            .join('')
            .slice(-3)
            .split('')
            .map(d => parseInt(d, settings.matrixLength))

          // e.g 01 - the chain index for this position
          const chainIndex = get(song, [chainPosition], [])

          // e.g. the chain for this position,
          // an array of an array of phrase indices
          const chain = get(chains, [chainIndex], [])
          const phrasesIndices = get(chain, [phrasePosition], [])

          // for each channel,
          range(settings.chainChannels).forEach(channel => {
            const phrase = get(phrases, [phrasesIndices[channel]], [])

            const note = get(phrase, ['notes', notePosition], null)
            const volume = get(phrase, ['volumes', notePosition], null)

            if (note !== null && volume > 0) {
              const letter = toLetter(note, true, true)
              synths[channel].triggerAttackRelease(
                letter,
                '32n',
                time,
                normalize.volume(volume)
              )
            }
          })
        },
        range(Math.pow(settings.matrixLength, 2) * song.length),
        '32n'
      )
      sequence.loop = loop
      // Start it,
      sequence.start()
      // and add it to the pool.
      songSequencePool.push(sequence)
    }
  }

  // const playPhrase = phrases => number => {
  //   // Find the correct phrase.
  //   const phrase = phrases[number]
  //   if (phrase) {
  //     const { notes, volumes } = {
  //       ...defaults.phrase,
  //       ...phrase
  //     }
  //     // Stop all sequences.
  //     // TODO: pop and dispose sequence, so we don't end up with an array
  //     // of unused sequences.
  //     sfxSequencePool.forEach(sequence => {
  //       sequence.stop()
  //     })
  //     // Create new sequence.
  //     const sequence = new Tone.Sequence(
  //       (time, event) => {
  //         const { note, volume } = event
  //         if (note !== null && volume > 0) {
  //           const letter = toLetter(note, true, true)
  //           synth.triggerAttackRelease(
  //             letter,
  //             '32n',
  //             time,
  //             normalize.volume(volume)
  //           )
  //         }
  //       },
  //       notes.map((note, index) => ({ note, volume: volumes[index] })),
  //       '32n'
  //     )
  //     // Make sure it doesn't loop.
  //     sequence.loop = false
  //     // Start it,
  //     sequence.start()
  //     // and add it to the pool.
  //     sfxSequencePool.push(sequence)
  //   }
  // }
  return {
    playSong
  }
}

export { createSynth, playNote }

export default soundAPI
