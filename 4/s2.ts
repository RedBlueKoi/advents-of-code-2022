export const a = 1

const input = await Deno.readTextFile('./input.txt')
const pairs = input.split('\n')

const getSections = (range: string): number[] => {
  // 38-38
  const [rangeStart, rangeEnd] = range.split('-').map(item => parseInt(item))
  return new Array(rangeEnd - rangeStart + 1)
    .fill(0)
    .map((_, index) => rangeStart + index)
}

const doesPairOverlap = (pair: string): boolean => {
  const [firstRange, secondRange] = pair.split(',')
  // 38-41,38-38
  const firstElfSections = getSections(firstRange)
  const secondElfSections = getSections(secondRange)

  return firstElfSections.some(section => secondElfSections.includes(section))
}

const solution = (): number => {
  return pairs.reduce((acc, pair) => {
    return doesPairOverlap(pair) ? acc + 1 : acc
  }, 0)
}

console.log(solution())
