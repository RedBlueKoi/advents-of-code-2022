export const a = 1

const input = await Deno.readTextFile('./input.txt')
const pairs = input.split('\n')

const doesPairOverlap = (pair: string): boolean => {
  const [firstRange, secondRange] = pair.split(',')
  // 38-41,38-38
  const [firstRangeStart, firstRangeEnd] = firstRange
    .split('-')
    .map(item => parseInt(item))
  const [secondRangeStart, secondRangeEnd] = secondRange
    .split('-')
    .map(item => parseInt(item))

  if (firstRangeStart >= secondRangeStart && firstRangeEnd <= secondRangeEnd) {
    return true
  }
  if (secondRangeStart >= firstRangeStart && secondRangeEnd <= firstRangeEnd) {
    return true
  }

  return false
}

const solution = (): number => {
  return pairs.reduce((acc, pair) => {
    return doesPairOverlap(pair) ? acc + 1 : acc
  }, 0)
}

console.log(solution())
