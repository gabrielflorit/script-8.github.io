import * as Tone from 'tone'
import _ from 'lodash'
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
  const synths = _.range(settings.chainChannels).map(createSynth)

  Tone.Transport.bpm.value = settings.bpm
  Tone.Transport.start()

  const songSequencePool = []

  const playSong = ({ songs, chains, phrases }) => (number, loop = false) => {
    const song = _.get(songs, number)
    if (!_.isNil(song)) {
      const notePositions = _(_.range(Math.pow(settings.matrixLength, 3)))
        .map(index => {
          // Get the chain, phrase and note positions by using base math.
          const [chainPosition, phrasePosition, notePosition] = _.padStart(
            index.toString(settings.matrixLength),
            3,
            0
          )
            .split('')
            .map(d => parseInt(d, settings.matrixLength))
          // Get the chain index for this position.
          const chainIndex = _.get(song, chainPosition)
          // Get the chain.
          const chain = _.get(chains, chainIndex)
          // Get the phrase indices for this position, e.g. { 0: 0, 1: 11, 2: 2 }
          const phrasesIndices = _.get(chain, phrasePosition)
          // For each channel,
          return _.range(settings.chainChannels)
            .map(channel => {
              const phraseIndex = _.get(phrasesIndices, channel)
              let result

              if (!_.isNil(phraseIndex)) {
                // get the phrase assigned to this channel.
                const phrase = _.get(phrases, phraseIndex)
                // Get the note element for this position.
                const noteElement = _.get(phrase, notePosition)
                // If we have a note,
                if (!_.isNil(noteElement)) {
                  // add it to the result.
                  result = {
                    channel,
                    noteElement
                  }
                }
              }
              return result
            })
            .filter(d => d)
        })
        .dropRightWhile(_.isEmpty)
        .value()

      // Stop all sequences.
      // TODO: pop and dispose sequence, so we don't end up with an array
      // of unused sequences.
      songSequencePool.forEach(sequence => {
        sequence.stop()
      })

      const sequence = new Tone.Sequence(
        (time, position) => {
          notePositions[position].forEach(d => {
            const { channel, noteElement } = d
            playNote({ ...noteElement, time, synth: synths[channel] })
          })
        },
        _.range(notePositions.length),
        '32n'
      )

      sequence.loop = loop
      // Start it,
      sequence.start()
      // and add it to the pool.
      songSequencePool.push(sequence)
    }
  }

  return {
    playSong
  }
}

export { createSynth, playNote }

export default soundAPI
