import runningSum from './runningSum.js'

test('runningSum', () => {
  expect(runningSum([2, 0, 0, 0, 0, 0, 1, 0])).toEqual([
    [0, 2],
    [2, 2],
    [2, 2],
    [2, 2],
    [2, 2],
    [2, 2],
    [2, 3],
    [3, 3]
  ])
})
