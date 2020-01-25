// TODO: if sustain exists, volume should also just show `-`

import * as Tone from 'tone'
import _ from 'lodash'
import toLetter from '../toLetter.js'
import normalize from '../normalize.js'
import settings from '../settings.js'

const slowToFastTempo = [1, 2, 3, 5, 8, 12, 20, 32]
const fastToSlowTempo = [...slowToFastTempo].reverse()

const tempoToPlaybackRate = tempo => slowToFastTempo[tempo]
const tempoToSubdivision = tempo =>
  fastToSlowTempo.map(i => ({ '16n': i }))[tempo]

const createSynth = ({ volumeNode, index }) => {
  let synth

  if (index === 0) {
    synth = new Tone.Synth({
      oscillator: {
        type: 'pulse',
        width: 0.5
      },
      envelope: {
        release: 0.07
      }
    })
    synth.script8Name = 'synth'
  }

  if (index === 1) {
    synth = new Tone.Synth({
      oscillator: {
        type: 'pulse',
        width: 0.75
      },
      envelope: {
        release: 0.07
      }
    })
    synth.script8Name = 'synth'
  }

  if (index === 2) {
    synth = new Tone.Synth({
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        release: 0.07
      }
    })
    synth.script8Name = 'synth'
  }

  if (index === 3) {
    synth = new Tone.NoiseSynth({
      envelope: {
        release: 0.07
      }
    })
    synth.script8Name = 'noise'
  }

  if (volumeNode) {
    synth.chain(volumeNode, Tone.Master)
  } else {
    synth.chain(Tone.Master)
  }

  return synth
}

const triggerAttack = ({
  note: letter,
  octave,
  volume,
  time = Tone.context.currentTime,
  synth
}) => {
  if (time >= Tone.context.currentTime) {
    const note = toLetter(letter + octave * 12, true, true)
    const velocity = normalize.volume(volume)
    if (synth.script8Name === 'synth') {
      synth.triggerAttack(note, time, velocity)
    }
    if (synth.script8Name === 'noise') {
      synth.triggerAttack(time, velocity)
    }
  }
}

const triggerAttackRelease = ({
  note: letter,
  octave,
  volume,
  time = Tone.context.currentTime,
  synth,
  tempo
}) => {
  if (time >= Tone.context.currentTime) {
    const note = toLetter(letter + octave * 12, true, true)
    const duration = tempoToSubdivision(tempo)
    const velocity = normalize.volume(volume)
    if (synth.script8Name === 'synth') {
      synth.triggerAttackRelease(note, duration, time, velocity)
    }
    if (synth.script8Name === 'noise') {
      synth.triggerAttackRelease(duration, time, velocity)
    }
  }
}

const triggerRelease = ({
  time = Tone.context.currentTime,
  delay = 0,
  synth
}) => {
  if (time >= Tone.context.currentTime) {
    synth.triggerRelease(time + delay)
  }
}

const soundAPI = volumeNode => {
  const chainSynths = _.range(settings.chainChannels).map(index =>
    createSynth({ volumeNode, index })
  )
  const songSynths = _.range(settings.chainChannels).map(index =>
    createSynth({ volumeNode, index })
  )
  const phraseSynth = createSynth({ volumeNode, index: 0 })

  Tone.Transport.bpm.value = settings.bpm
  Tone.Transport.start(settings.startOffset)

  let songContainers = {}
  let chainContainers = {}
  let localPhrases = {}
  let phrasePool = []

  const stopChain = () => {
    _.forEach(chainContainers, ({ sequence }, key) => {
      if (sequence) {
        sequence.stop()
        chainSynths.forEach(synth => triggerRelease({ synth }))
      }
    })
  }

  const stopSong = () => {
    // Stop all sequences.
    // console.log('soundAPI.stopSong() BEGIN----------')
    // const before = Date.now()
    _.forEach(songContainers, ({ sequence }, key) => {
      if (sequence) {
        sequence.stop()
        songSynths.forEach(synth => triggerRelease({ synth }))
        // console.log(`stopping song with key: ${key}`)
      }
    })
    // const after = Date.now()
    // console.log(`soundAPI.stopSong() END ${after - before}ms`)
  }

  const makeSongsAndChains = ({ songs, chains, phrases }) => {
    // console.log(`soundAPI.makeSongs() BEGIN----------`)
    // const before = Date.now()
    stopSong()
    stopChain()
    localPhrases = phrases
    songContainers = _.mapValues(songs, song =>
      makeSongContainer({ song, chains, phrases })
    )
    chainContainers = _.mapValues(chains, chain =>
      makeChainContainer({ chain, phrases })
    )
    // const after = Date.now()
    // console.log(`soundAPI.makeSongs() END ${after - before}ms`)
  }

  const makeChainContainer = ({ chain, phrases }) => {
    const notePositions = _(_.range(Math.pow(settings.matrixLength, 2)))
      .map(index => {
        // Get the phrase and note positions by using base math.
        const [phrasePosition, notePosition] = _.padStart(
          index.toString(settings.matrixLength),
          2,
          0
        )
          .split('')
          .map(d => parseInt(d, settings.matrixLength))

        // Get the phrase indices for this position, e.g. { 0: 0, 1: 11, 2: 2 }
        const phrasesIndices = _.get(chain, phrasePosition)

        // For each channel,
        return _.range(settings.chainChannels).map(channel => {
          // Get the phrase index for this channel.
          const phraseIndex = _.get(phrasesIndices, channel)
          let result

          // If the phrase index exists,
          if (!_.isNil(phraseIndex)) {
            // get the phrase assigned to this channel.
            const phrase = _.get(phrases, phraseIndex, {})

            // Get the note element for this position.
            const noteElement = _.get(phrase.notes, notePosition)

            // If we have a note,
            if (!_.isNil(noteElement)) {
              // add it to the result.
              result = {
                noteElement,
                tempo: chain.tempo
              }
            }
          }
          return result
        })
      })
      // NOW we can drop from right.
      .dropRightWhile(d =>
        _(d)
          .compact()
          .isEmpty()
      )
      .value()

    const callback = (time, position) => {
      // For every column cell on the grid,
      notePositions[position].forEach((d, channel) => {
        // if the channel has a note:
        if (d && !_.isNil(d.noteElement)) {
          // If we're on the last position of the entire array,
          if (position === notePositions.length - 1) {
            // if we have a note, triggerAttackRelease.
            if (d.noteElement.octave > -1) {
              triggerAttackRelease({
                ...d.noteElement,
                time,
                synth: chainSynths[channel],
                tempo: d.tempo
              })
            }
            // If we have a sustain, triggerRelease(time + duration).
            if (d.noteElement.octave === -1) {
              triggerRelease({
                time,
                synth: chainSynths[channel],
                delay: Tone.Time(tempoToSubdivision(d.tempo)).valueOf()
              })
            }
          } else {
            // If we're not on the last position of the array,
            // if we have a note, triggerAttack.
            if (d.noteElement.octave > -1) {
              triggerAttack({
                ...d.noteElement,
                time,
                synth: chainSynths[channel]
              })
            }
            // If we have a sustain, do nothing.
            if (d.noteElement.octave === -1) {
            }
          }
        } else {
          // If the channel does not have a note, stop it.
          triggerRelease({ time, synth: chainSynths[channel] })
        }
      })
    }

    const events = _.range(notePositions.length)

    return {
      callback,
      events,
      sequence: null,
      tempo: chain.tempo
    }
  }

  const makeSongContainer = ({ song, chains, phrases }) => {
    // const before = Date.now()
    // Create an array of note positions.
    // There's a lot going on here, but the gist:
    // create an array of all the notes, but remove nulls from the end,
    // so that we can make a Tone Sequence that is the right length and no more.
    // This is good for performance.

    // For matrixLength cubed (chains * phrases * notes),
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
        return _.range(settings.chainChannels).map(channel => {
          // Get the phrase index for this channel.
          const phraseIndex = _.get(phrasesIndices, channel)
          let result

          // If the phrase index exists,
          if (!_.isNil(phraseIndex)) {
            // get the phrase assigned to this channel.
            const phrase = _.get(phrases, phraseIndex, {})

            // Get the note element for this position.
            const noteElement = _.get(phrase.notes, notePosition)

            // If we have a note,
            if (!_.isNil(noteElement)) {
              // add it to the result.
              result = {
                noteElement,
                tempo: song.tempo
              }
            }
          }
          return result
        })
      })
      // NOW we can drop from right.
      .dropRightWhile(d =>
        _(d)
          .compact()
          .isEmpty()
      )
      .value()

    const callback = (time, position) => {
      // For every column cell on the grid,
      notePositions[position].forEach((d, channel) => {
        // if the channel has a note:
        if (d && !_.isNil(d.noteElement)) {
          // If we're on the last position of the entire array,
          if (position === notePositions.length - 1) {
            // if we have a note, triggerAttackRelease.
            if (d.noteElement.octave > -1) {
              triggerAttackRelease({
                ...d.noteElement,
                time,
                synth: songSynths[channel],
                tempo: d.tempo
              })
            }
            // If we have a sustain, triggerRelease(time + duration).
            if (d.noteElement.octave === -1) {
              triggerRelease({
                time,
                synth: songSynths[channel],
                delay: Tone.Time(tempoToSubdivision(d.tempo)).valueOf()
              })
            }
          } else {
            // If we're not on the last position of the array,
            // if we have a note, triggerAttack.
            if (d.noteElement.octave > -1) {
              triggerAttack({
                ...d.noteElement,
                time,
                synth: songSynths[channel]
              })
            }
            // If we have a sustain, do nothing.
            if (d.noteElement.octave === -1) {
            }
          }
        } else {
          // If the channel does not have a note, stop it.
          triggerRelease({ time, synth: songSynths[channel] })
        }
      })
    }

    const events = _.range(notePositions.length)

    // const after = Date.now()
    // console.log(`soundAPI.makeSongContainer() took ${after - before}ms`)

    return {
      callback,
      events,
      sequence: null,
      tempo: song.tempo
    }
  }

  const playSong = (number, loop = false) => {
    // console.log(`soundAPI.playSong() BEGIN----------`)
    // const before = Date.now()
    stopSong()

    // console.log(`going to play song with key ${number}`)
    _.forEach(songContainers, (value, key) => {
      if (+key === number) {
        // console.log(`found one: key ${key}`)
        value.sequence = new Tone.Sequence(
          value.callback,
          value.events,
          settings.subdivision
        )
        value.sequence.loop = loop
        value.sequence.playbackRate = tempoToPlaybackRate(value.tempo)
        value.sequence.start(settings.startOffset)
      }
    })
    // const after = Date.now()
    // console.log(`soundAPI.playSong() END took ${after - before}ms`)
  }

  const playChain = (number, loop = false) => {
    // console.log(`soundAPI.playSong() BEGIN----------`)
    // const before = Date.now()
    stopChain()

    // console.log(`going to play song with key ${number}`)
    _.forEach(chainContainers, (value, key) => {
      if (+key === number) {
        // console.log(`found one: key ${key}`)
        value.sequence = new Tone.Sequence(
          value.callback,
          value.events,
          settings.subdivision
        )
        value.sequence.loop = loop
        value.sequence.playbackRate = tempoToPlaybackRate(value.tempo)
        value.sequence.start(settings.startOffset)
      }
    })
    // const after = Date.now()
    // console.log(`soundAPI.playSong() END took ${after - before}ms`)
  }

  const playPhrase = number => {
    // const before = Date.now()
    const phrase = _.get(localPhrases, number)
    if (phrase) {
      while (phrasePool.length) {
        const popped = phrasePool.pop()
        popped.dispose()
      }

      const { tempo } = phrase

      const sequence = new Tone.Sequence(
        (time, index) => {
          const value = phrase.notes[index]
          // if (value) {
          //   playNote({ ...value, time, synth: phraseSynth, tempo })
          // }

          // If there is a note,
          if (value) {
            // If we're on the last position of the phrase,
            if (index === settings.matrixLength - 1) {
              // if we have a note, triggerAttackRelease.
              // If we have a sustain, triggerRelease(time + duration).
              if (value.octave > -1) {
                triggerAttackRelease({
                  ...value,
                  time,
                  synth: phraseSynth,
                  tempo
                })
              }
              if (value.octave === -1) {
                triggerRelease({
                  time,
                  synth: phraseSynth,
                  delay: Tone.Time(tempoToSubdivision(tempo)).valueOf()
                })
              }
            } else {
              // If we're not on the last position of the array,
              // if we have a note, triggerAttack.
              if (value.octave > -1) {
                triggerAttack({
                  ...value,
                  time,
                  synth: phraseSynth
                })
              }
              // If it's sustain, do nothing.
              if (value.octave === -1) {
              }
            }
          } else {
            // If there is no note, triggerRelease.
            triggerRelease({ time, synth: phraseSynth })
          }
        },
        _.range(settings.matrixLength),
        settings.subdivision
      )
      sequence.loop = false
      sequence.playbackRate = tempoToPlaybackRate(tempo)
      sequence.start()
      phrasePool.push(sequence)
      // const after = Date.now()
      // console.log(`soundAPI.playPhrase() took ${after - before}ms`)
    }
  }
  return {
    playPhrase,
    playChain,
    stopChain,
    playSong,
    stopSong,
    makeSongsAndChains
  }
}

export {
  createSynth,
  tempoToPlaybackRate,
  triggerAttack,
  triggerAttackRelease,
  triggerRelease
}

export default soundAPI
