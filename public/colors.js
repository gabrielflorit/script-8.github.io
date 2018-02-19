const all = [
  '#f6d6bd',
  '#c3a38a',
  '#997577',
  '#816271',
  '#4e495f',
  '#20394f',
  '#0f2a3f',
  '#08141e'
]

const colors = {
  all,
  one (i) {
    return all[i % all.length]
  }
}

export default colors
