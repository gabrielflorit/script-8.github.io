const patcher = ({ slides, index }) => {
  return slides
    .slice(0, index + 1)
    .map(d => d.game)
    .reduce((accumulator, current) => {
      if (current && current.length) {
        const lines = accumulator.split('\n')

        // If it starts with one of the patching keywords,
        // run the patch.
        // Otherwise return text.

        const deleteOne = current.match(/^DEL(\d+)$/)
        const deleteRange = current.match(/^DEL(\d+)-(\d+)$/)
        const replaceOne = current.match(/^REP(\d+)/)
        const replaceRange = current.match(/^REP(\d+)-(\d+)/)
        const add = current.match(/^ADD(\d+)/)
        const same = current.match(/^SAME$/)
        if (deleteOne) {
          // Get line number to delete.
          const lineNumberToDelete = +deleteOne[1]
          // Delete the line.
          const newLines = [
            ...lines.slice(0, lineNumberToDelete),
            ...lines.slice(lineNumberToDelete + 1)
          ]

          return newLines.join('\n')
        } else if (deleteRange) {
          // Get line numbers to delete.
          const lineNumberToDeleteStart = +deleteRange[1]
          const lineNumberToDeleteEnd = +deleteRange[2]
          const newLines = [
            ...lines.slice(0, lineNumberToDeleteStart),
            ...lines.slice(lineNumberToDeleteEnd + 1)
          ]

          return newLines.join('\n')
        } else if (replaceRange) {
          // Get line numbers to delete.
          const lineNumberToReplaceStart = +replaceRange[1]
          const lineNumberToReplaceEnd = +replaceRange[2]
          const newLines = [
            ...lines.slice(0, lineNumberToReplaceStart),
            ...current.substring(replaceRange[0].length + 1).split('\n'),
            ...lines.slice(lineNumberToReplaceEnd + 1)
          ]

          return newLines.join('\n')
        } else if (replaceOne) {
          const lineNumberToReplace = +replaceOne[1]
          const newLines = [
            ...lines.slice(0, lineNumberToReplace),
            ...current.substring(replaceOne[0].length + 1).split('\n'),
            ...lines.slice(lineNumberToReplace + 1)
          ]

          return newLines.join('\n')
        } else if (add) {
          // Get line numbers to add.
          const lineNumberToAdd = +add[1]
          const newLines = [
            ...lines.slice(0, lineNumberToAdd),
            ...current.substring(add[0].length + 1).split('\n'),
            ...lines.slice(lineNumberToAdd)
          ]

          return newLines.join('\n')
        } else if (same) {
          return accumulator
        } else {
          return current
        }
      } else {
        return accumulator
      }
    }, '')
}

export default patcher
