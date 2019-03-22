const validateToken = ({ token, blacklist, globals, shadows }) => {
  let isValid

  // If user types a token in blacklist,
  // it's most definitely invalid.
  if (blacklist.has(token)) {
    isValid = false
  } else if (
    // If user types a token defined in globals or updateableGlobals,
    // it's valid.
    globals.has(token)
  ) {
    isValid = true
  } else if (window.hasOwnProperty(token)) {
    // If user types a token on window scope (e.g. `screen`),
    // add it to the list of __shadows, and make it valid.
    shadows.add(token)
    isValid = true
  } else {
    // Otherwise, return valid.
    isValid = true
  }

  return isValid
}

export default validateToken
