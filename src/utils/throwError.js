const throwError = ({ error, message }) => {
  error.message = [error.message, message].join('. ')
  throw new Error(error)
}

export default throwError
