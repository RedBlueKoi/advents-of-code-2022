export const a = 1

const input = await Deno.readTextFile('./input.txt')

interface Elf {
  id: number
  caloriesTotal: number
  items: number[]
}

const elves: Elf[] = input
  .split('\n\n')
  .map((elf, index) => {
    const items = elf.split('\n').map(item => parseInt(item))
    return {
      id: index,
      items,
      caloriesTotal: items.reduce((acc, item) => acc + item, 0)
    }
  })
  .sort((a, b) => b.caloriesTotal - a.caloriesTotal)

console.log(elves.slice(0, 3).reduce((acc, elf) => acc + elf.caloriesTotal, 0))
