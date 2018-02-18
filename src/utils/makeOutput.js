const outputOptions = {
  help: 'Type <em>help</em> for help.'
}

const errorOutput =
  "<span class='error'>I did not understand that command.</span>"

const makeOutput = input => {
  return outputOptions[input.trim()] || errorOutput
}

export default makeOutput
