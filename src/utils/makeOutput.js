const outputOptions = {
  intro: 'Hello. My name is Computor. Welcome!',
  help: `
    <div>Type <em>clear</em> to clear the screen.</div>
    <div>Type <em>help</em> for help.</div>
  `,
  clear: "Sorry - I haven't figured how to do that yet!"
}

const errorOutput =
  "<span class='error'>I did not understand that command.</span>"

const makeOutput = input => {
  return outputOptions[input] || errorOutput
}

export default makeOutput
