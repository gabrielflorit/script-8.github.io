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
          'Click HELP in the top menu.'
        ],
        requirements: {
          screen: screenTypes.HELP
        }
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
  },
  {
    title: 'Hello world!',
    slides: [
      {
        text: [
          'In this lesson we will make a cassette that says "Hello world!".',
          'This might not be too exciting, but all good stories start at the beginning.',
          "So let's begin."
        ]
      },
      {
        text: [
          'We need to go to the CODE screen to write our code.',
          'Click CODE in the top menu, and make sure to remove any existing code.'
        ],
        requirements: {
          screen: screenTypes.CODE,
          game: ''
        }
      },
      {
        screen: screenTypes.CODE,
        text: [
          'Enter the following lines:',
          'XXdraw = () => {',
          "XX  print(0, 0, 'Hello world!', 0)",
          'XX}'
        ]
      },
      {
        game: `draw = () => {
  print(0, 0, 'Hello world!', 0)
}`,
        screen: screenTypes.CODE,
        text: [
          'Your first SCRIPT-8 cassette!',
          'Save it! This is, after all, the beginning of your story.',
          'Mouseover CASSETTE, on the menu, and click RECORD.'
        ]
      },
      {
        text: [
          "You'll notice the URL changed.",
          "It's your cassette's URL now.",
          'You can share it with family and friends.'
        ]
      },
      {
        text: [
          "In the next lesson we'll try to understand what we typed here.",
          'It is always good to know what is going on.',
          'Good-bye for now. See you soon!'
        ]
      }
    ]
  },
  {
    title: 'Hello many worlds!',
    slides: [
      {
        text: ['Coming soon.']
      }
    ]
  }
]

export default lessons
