import { detect } from 'detect-browser'

const browser = detect()

const regexLookup = {
  /* Chrome Stack Trace Example:

     TypeError: Cannot read property 'toString' of undefined
     at print (print.js:7)
     at print (index.js:72)
     at draw (eval at <anonymous> (eval at evalCode (Iframe.js:644)), <anonymous>:2:3)
     at Iframe.drawUserGraphics (Iframe.js:397)
     at timerCallback (Iframe.js:702)
     at tick (interval.js:10)
     at timerFlush (timer.js:61)
     at wake (timer.js:71)
  */
  chrome: /\(eval at <anonymous> \(eval at evalCode \(.+:\d+\)\), <anonymous>:(\d+):(\d+)\)/,
  /* Firefox Stack Trace Example:

     print@http://localhost:3001/static/js/bundle.js:69091:7
     print@http://localhost:3001/static/js/bundle.js:68699:7
     draw@http://localhost:3001/static/js/bundle.js line 67598 > eval line 6 > eval:2:3
     drawUserGraphics@http://localhost:3001/static/js/bundle.js:67340:9
     timerCallback@http://localhost:3001/static/js/bundle.js:67650:11
     tick@http://localhost:3001/static/js/bundle.js:1475:5
     timerFlush@http://localhost:3001/static/js/bundle.js:1580:40
     wake@http://localhost:3001/static/js/bundle.js:1590:5

  */
  firefox: /line \d+ > eval line \d+ > eval:(\d+):(\d+)/,
  /* Edge Stack Trace Example:

     TypeError: Unable to get property 'toString' of undefined or null reference
     at print (http://localhost:3001/static/js/bundle.js:69091:3)
     at print (http://localhost:3001/static/js/bundle.js:68699:7)
     at draw (eval code:2:3)
     at drawUserGraphics (http://localhost:3001/static/js/bundle.js:67340:9)
     at timerCallback (http://localhost:3001/static/js/bundle.js:67650:11)
     at tick (http://localhost:3001/static/js/bundle.js:1475:5)
     at timerFlush (http://localhost:3001/static/js/bundle.js:1580:40)
     at wake (http://localhost:3001/static/js/bundle.js:1590:5)
  */
  edge: /\(eval code:(\d+):(\d+)\)/
}

export function getEvaledErrorPosition(error) {
  const regex = regexLookup[browser.name]
  if (regex && error.stack) {
    const match = regex.exec(error.stack)
    if (match) {
      return {
        line: match[1],
        column: match[2]
      }
    }
  } else if (browser.name === 'safari') {
    return {
      line: error.line,
      column: error.column
    }
  }
}
