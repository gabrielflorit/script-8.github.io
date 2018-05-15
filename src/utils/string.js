const replaceAt = (str, index, replacement) =>
  str.substr(0, index) +
  replacement +
  str.substr(index + replacement.toString().length)

export { replaceAt }
