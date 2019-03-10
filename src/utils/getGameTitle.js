const getGameTitle = game => {
  const match = game[0].text.split('\n')[0].match(/\/\/\s*title:\s*(\S.*)/)
  const title = match ? match[1].trim().toUpperCase() : null
  return title
}

export default getGameTitle
