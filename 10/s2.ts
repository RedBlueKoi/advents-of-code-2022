export const a = 1

const input = await Deno.readTextFile('./input.txt')
// const input = await Deno.readTextFile('./test.txt')
const inputs = input.split('\n')

enum Command {
  ADD = 'addx',
  NOOP = 'noop'
}

interface Input {
  command: Command
  value: number | null
  started: number
}

const stepSize = 40
const minCycle = 1
const maxCycle = 240
const cyclesToCheck: number[] = []
let currentInput: Input | null = null
let register = 1
const screen: string[][] = [[], [], [], [], [], []]

const generateCheckPoints = () => {
  let point = stepSize
  while (point <= maxCycle) {
    cyclesToCheck.push(point)
    point += stepSize
  }
}

const getParsedInput = (cycle: number): Input | null => {
  const line = inputs.shift()
  if (!line) return null
  const [lineCommand, lineValue] = line.split(' ')
  return {
    command: lineCommand as Command,
    value: lineValue ? parseInt(lineValue) : null,
    started: cycle
  }
}

const isInputFinished = (currentCycle: number): boolean => {
  if (currentInput === null) return true
  const { started, command } = currentInput
  if (command === Command.NOOP) return currentCycle - 1 === started
  if (command === Command.ADD) return currentCycle - 2 === started

  return true
}

const drawPixel = (cycle: number) => {
  const lineIndex = cyclesToCheck.findIndex(item => item >= cycle)
  const crtPosition = (cycle - 1) % stepSize
  const drawableIndexes = [register - 1, register, register + 1]
  const pixelValue = drawableIndexes.includes(crtPosition) ? '#' : '.'
  screen[lineIndex].push(pixelValue)
}

const solution = () => {
  generateCheckPoints()
  for (let cycle = minCycle; cycle <= maxCycle; cycle++) {
    if (isInputFinished(cycle)) {
      if (currentInput?.value) register += currentInput.value
      currentInput = getParsedInput(cycle)
    }

    drawPixel(cycle)
  }

  console.log('------------------')
  console.log(`Resulting image:`)
  screen.forEach(line => console.log(line.join('')))
}

solution()
