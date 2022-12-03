export const a = 1

const input = await Deno.readTextFile('./input.txt')
const rucksacks = input.split('\n')
const groupsOfThree: string[][] = rucksacks.reduce(
  (acc: string[][], rucksack: string) => {
    if (acc.length === 0) acc.push([rucksack])
    else if (acc[acc.length - 1].length === 3) acc.push([rucksack])
    else acc[acc.length - 1].push(rucksack)
    return acc
  },
  []
)

// a = 1 => 97 - 1 = 96
// z = 26
// A = 27 => 65 - 27 = 38
// Z = 52
const lowerCaseDelta = 96
const upperCaseDelta = 38

const getPriorityNumber = (group: string[]): number => {
  const [one, two, three] = group
  const priority = one.split('').filter(char => {
    return two.includes(char) && three.includes(char)
  })

  const priorityCode = priority[0].charCodeAt(0)

  return priorityCode > 96
    ? priorityCode - lowerCaseDelta
    : priorityCode - upperCaseDelta
}

const solution = () => {
  return groupsOfThree.reduce((acc, group: string[]) => {
    return acc + getPriorityNumber(group)
  }, 0)
}

console.log(solution())
