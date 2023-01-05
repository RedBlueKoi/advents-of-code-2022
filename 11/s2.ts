export const a = 1

const input = await Deno.readTextFile('./input.txt')
// const input = await Deno.readTextFile('./test.txt')
const inputs = input.split('\n\n')

type Monkey = {
  id: number
  worries: number[]
  operation: (worry: number) => number
  nextPositive: number
  nextNegative: number
  divisor: number
  inspectionCount: number
}

const parseMonkey = (input: string): Monkey => {
  const [
    indexLine,
    worriesLine,
    operationLine,
    devisorLine,
    trueLine,
    falseLine
  ] = input.split(`\n`)
  // Monkey id
  const id = parseInt(indexLine.replace('Monkey ', ''))
  // Worries
  const worries = worriesLine
    .replace('  Starting items: ', '')
    .split(', ')
    .map(i => parseInt(i))
  // Operation
  const operation = (worry: number) => {
    const [op, amount] = operationLine
      .replace('  Operation: new = old ', '')
      .split(' ')

    const parsedAmount = amount === 'old' ? worry : parseInt(amount)
    switch (op) {
      case '+':
        return worry + parsedAmount
      case '*':
        return worry * parsedAmount
      default:
        throw new Error('Invalid operation')
    }
  }
  // Divisor
  const divisor = parseInt(devisorLine.replace('  Test: divisible by ', ''))
  // Next monkeys
  const nextPositive = parseInt(
    trueLine.replace('    If true: throw to monkey ', '')
  )
  const nextNegative = parseInt(
    falseLine.replace('    If false: throw to monkey ', '')
  )

  return {
    id,
    worries,
    operation,
    divisor,
    nextPositive,
    nextNegative,
    inspectionCount: 0
  }
}

const solution = () => {
  const monkeys: Monkey[] = inputs.map(parseMonkey)
  const globalMod = monkeys.reduce((a, b) => a * b.divisor, 1)

  let currentRound = 0
  const maxRounds = 10000
  while (currentRound < maxRounds) {
    if (currentRound % 1000 === 0) console.log(`Round ${currentRound}`)

    monkeys.forEach(monkey => {
      if (currentRound % 1000 === 0) {
        console.log(
          `Monkey ${monkey.id} inspected ${monkey.inspectionCount} times`
        )
      }

      while (monkey.worries.length > 0) {
        monkey.inspectionCount++
        const worry = monkey.worries.shift()!

        const newWorry = monkey.operation(worry)
        const nextMonkey =
          newWorry % monkey.divisor === 0
            ? monkey.nextPositive
            : monkey.nextNegative
        monkeys[nextMonkey].worries.push(newWorry % globalMod)
      }
    })
    currentRound++
  }

  console.table(monkeys.map(m => m.inspectionCount))

  const monkeyBusinessValue = monkeys
    .sort((a, b) => a.inspectionCount - b.inspectionCount)
    .slice(-2)
    .reduce((a, b) => a * b.inspectionCount, 1)
  console.log(`Monkey business value: ${monkeyBusinessValue}`)
}

solution()
