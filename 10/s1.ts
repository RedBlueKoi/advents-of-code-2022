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
const minCycle = 20
const maxCycle = 220
const cyclesToCheck: number[] = []
const history: number[] = []
let currentInput: Input | null = null
let register = 1

const generateCheckPoints = () => {
  let point = minCycle
  while (point <= maxCycle) {
    cyclesToCheck.push(point)
    point += stepSize
  }
}

const saveSignalStrength = (cycle: number) => {
  history.push(register * cycle)
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

const solution = () => {
  generateCheckPoints()
  for (let cycle = 1; cycle <= maxCycle; cycle++) {
    if (isInputFinished(cycle)) {
      if (currentInput?.value) register += currentInput.value
      currentInput = getParsedInput(cycle)
    }

    if (cyclesToCheck.includes(cycle)) saveSignalStrength(cycle)
    console.log(`Cycle ${cycle} | Register ${register}`)
  }

  const sum = history.reduce((acc, signal) => acc + signal, 0)
  console.log('------------------')
  console.log(`Sum of signals: ${sum}`)
}

solution()
