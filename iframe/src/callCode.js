import { interval } from 'd3-timer'
import once from 'lodash/once'

const FPS = 60
let timer

const callCode = ({ game, shadows, message, callbacks }) => {
  try {
    // Make available an end function, and call the callback once.
    window._script8.end = once(() => {
      message.ports[0].postMessage({
        callback: callbacks.endCallback
      })
    })

    // Eval the supplied game.
    const shadowString = `var ${[...shadows].join(',')}`
    // eslint-disable-next-line no-eval
    eval(`
      // Shadow variables we don't want available.
      ${shadowString}
      // The inception eval allows the user to declare vars (e.g. screen).
      eval(game)
    `)
    const timerCallback = elapsed => {
      try {
        // and call draw.
        const { script8 } = window
        script8 && script8.update && script8.update()
        script8 && script8.draw && script8.draw()
      } catch (e) {
        // If there is an error, print it as a warning.
        console.warn(e.message)
      }
    }
    if (timer) {
      timer.stop()
    }
    timer = interval(timerCallback, 1000 / FPS)
  } catch (e) {
    // If any part of this resulted in an error, print it.
    console.warn(e.message)
  }
  message.ports[0].postMessage({
    height: document.body.querySelector('.container').scrollHeight
  })
}

export default callCode
