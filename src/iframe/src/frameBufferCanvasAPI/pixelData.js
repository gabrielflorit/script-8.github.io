const pixelData = ({ width, height }) => {
  // Pixel data has the actual image data object which can be passed to putImageData.
  const _pixelData = new ImageData(width, height)

  // This contains the actual binary data for setting on _pixelData. It cannot
  // be accessed directly, but is instead modified through TypedArrays such as
  // Uint8ClampedArray and Uint32Array. Both the TypedArrays below refer to
  // the same backing buffer, so modifying values via one will be reflected in
  // the other.
  const _pixelBuffer = new ArrayBuffer(4 * width * height)

  // The pixelBytes array is only used to set the data in the _pixelData
  // object. ImageData only has an Uint8ClampedArray to access the underlying
  // bytes, so a Uint8ClampedArray must be kept around to copy the data.
  const _pixelBytes = new Uint8ClampedArray(_pixelBuffer)

  // It turns out that setting pixels all at once via a single integer is much
  // faster than setting each byte individually. So the pixel data is only
  // ever modified via the Uint32Array for performance reasons.
  const _pixelIntegers = new Uint32Array(_pixelBuffer)

  const writePixelDataToCanvas = ctx => {
    _pixelData.data.set(_pixelBytes)
    ctx.putImageData(_pixelData, 0, 0)
  }

  return {
    pixels: _pixelIntegers,
    writePixelDataToCanvas
  }
}

export default pixelData
