import screenTypes from './screenTypes.js'

const lessons = [
  {
    title: "Welcome to SCRIPT-8's lesson mode.",
    shortTitle: 'Introduction',
    slides: [
      {
        text: [
          'We are going to learn how to make games!',
          'Each lesson will introduce a new concept.'
        ]
      },
      {
        text: [
          'We will learn to draw characters and make them move.',
          'We will learn to make worlds for our characters.',
          "Then we'll add enemies and a bit of music, of course."
        ]
      },
      {
        text: [
          "You'll find the list of lessons in HELP.",
          'Click NEXT to go there.'
        ]
      },
      {
        screen: screenTypes.HELP,
        text: [
          'All the lessons are listed here, at the top.',
          "Alright. That's enough introduction for now.",
          "Let's start!"
        ]
      }
    ]
  }
]

export default lessons
