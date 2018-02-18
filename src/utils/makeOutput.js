import commands from './commands.js'

const errorOutput =
  "<span class='error'>I did not understand that command.</span>"

const makeOutput = input => {
  // Find the right command.
  const command = commands.find(input)

  let output

  // If we have a command,
  if (command) {
    // and it has an output function,
    if (command.output) {
      // use that.
      output = command.output()
    } else {
      // Else we have a command with no output function (e.g. clear).
      output = ''
    }
  } else {
    // We could't find the command - return error.
    output = errorOutput
  }

  return output
}

export default makeOutput
