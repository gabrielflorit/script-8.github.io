const replaceAt = (str, index, replacement) =>
  str.substr(0, index) +
  replacement +
  str.substr(index + replacement.toString().length)

const numberWithCommas = x => {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export { replaceAt, numberWithCommas }
