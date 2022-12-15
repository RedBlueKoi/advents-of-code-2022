export const a = 1

const input = await Deno.readTextFile('./input.txt')
const [cratesInput, movesInput] = input.split('\n\n')

interface Stack {
  id: number
  crates: string[]
}

const parseStacks = (): Stack[] => {
  const result: Stack[] = []
  const lines = cratesInput.split('\n').reverse()

  const firstLine = lines.shift() // remove first line with numbers
  if (!firstLine) return []
  const numbers = firstLine.split(' ').filter(item => item !== '') as string[]

  numbers.forEach(index => {
    const stack: Stack = {
      id: parseInt(index) - 1,
      crates: []
    }

    const stackStartIndex = firstLine.indexOf(index) - 1
    lines.forEach(line => {
      const crate = line.slice(stackStartIndex, stackStartIndex + 3)
      if (crate === '   ') return
      stack.crates.push(crate.slice(1, 2))
    })

    result.push(stack)
  })

  return result
}

const stacks = parseStacks()

const move = (moveInput: string) => {
  const [amount, from, to] = moveInput
    .split(' ')
    .map(item => parseInt(item))
    .filter(item => !isNaN(item))

  const fromStack = stacks[from - 1]
  const toStack = stacks[to - 1]

  for (let index = 0; index < amount; index++) {
    const crate = fromStack.crates.pop()
    if (!crate) return 'error'
    toStack.crates.push(crate)
  }
}

const solution = () => {
  const moves = movesInput.split('\n')
  moves.forEach(movesInput => move(movesInput))
  console.log(
    stacks.map(stack => stack.crates[stack.crates.length - 1]).join('')
  )
  return stacks
}

solution()
