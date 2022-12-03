export const a = 1

const input = await Deno.readTextFile('./input.txt')
const rucksacks = input.split('\n')

// a = 1 => 97 - 1 = 96
// z = 26
// A = 27 => 65 - 27 = 38
// Z = 52
const lowerCaseDelta = 96
const upperCaseDelta = 38

const getPriorityNumber = (rucksack: string): number => {
  const left = rucksack.substring(0, rucksack.length / 2)
  const right = rucksack.substring(rucksack.length / 2, rucksack.length)
  const priority = left.split('').filter(letter => right.includes(letter))
  const priorityCode = priority[0].charCodeAt(0)

  return priorityCode > 96
    ? priorityCode - lowerCaseDelta
    : priorityCode - upperCaseDelta
}

const solution = () => {
  return rucksacks.reduce((acc, rucksack: string) => {
    return acc + getPriorityNumber(rucksack)
  }, 0)
}

console.log(solution())
