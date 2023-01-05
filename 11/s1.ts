export const a = 1

const input = await Deno.readTextFile('./input.txt')
// const input = await Deno.readTextFile('./test.txt')
const inputs = input.split('\n\n')

interface Monkey {
  id: number
  items: number[]
  operation: (item: number) => number
  test: (item: number) => boolean
  negativeMonkeyIndex: number
  positiveMonkeyIndex: number
  inspectCount: number
}

const maxRounds = 20
const stressDivisor = 3

const getMonkey = (input: string): Monkey => {
  console.log(`Monkey input:`)
  console.log('------------------')
  const [indexLine, itemsLine, operationLine, ...testLines] = input
    .split('\n')
    .map(line => line.trim())

  const items = itemsLine.split(': ')[1].split(', ').map(Number)

  const [_, operationType, operationValue] = operationLine
    .split(': ')[1]
    .split(' = ')[1]
    .split(' ')

  const operation = (item: number): number => {
    const increment = operationValue === 'old' ? item : Number(operationValue)
    let result = 0
    switch (operationType) {
      case '*':
        result = item * increment
        break
      case '+':
        result = item + increment
        break
      default:
        result = item
        break
    }
    return Math.floor(result / stressDivisor)
  }

  const [conditionLine, positiveLine, negativeLine] = testLines
  const test = (item: number) => {
    const [action, amount] = conditionLine.split(': ')[1].split(' by ')
    // console.log(`Monkey ${indexLine.split(' ')[1]} is testing item ${item}`)

    switch (action) {
      case 'divisible': {
        const result = item % Number(amount) === 0
        // console.log(`Item ${item} is divisible by ${amount}: ${result}`)
        return result
      }
      default:
        return item > Number(amount)
    }
  }

  return {
    id: Number(indexLine.split(' ')[1].replaceAll(':', '')),
    items,
    operation,
    test,
    negativeMonkeyIndex: Number(negativeLine.split('monkey ')[1]),
    positiveMonkeyIndex: Number(positiveLine.split('monkey ')[1]),
    inspectCount: 0
  }
}

const solution = () => {
  const monkeys = inputs.map(input => getMonkey(input))
  console.log(monkeys)

  for (let round = 0; round < maxRounds; round++) {
    console.log(`Round ${round + 1}:`)

    monkeys.forEach(monkey => {
      const { items } = monkey
      monkey.items = items.map(item => {
        monkey.inspectCount++
        return monkey.operation(item)
      })

      console.log(`Monkey ${monkey.id} items: ${monkey.items}`)

      while (monkey.items.length) {
        const item = monkey.items.shift()
        if (!item) return
        const nextMonkey = monkey.test(item)
          ? monkey.positiveMonkeyIndex
          : monkey.negativeMonkeyIndex
        monkeys[nextMonkey].items.push(item)
      }
    })
    console.log('------------------')
  }

  // console.log(monkeys)

  console.log('After 20 rounds:')
  const monkeyBusinessValue = monkeys
    .sort((a, b) => b.inspectCount - a.inspectCount)
    .map(monkey => {
      console.log(
        `Monkey ${monkey.id} inspected items ${monkey.inspectCount} times`
      )
      return monkey
    })
    .filter((_, index) => index < 2)
    .reduce((acc, monkey) => acc * monkey.inspectCount, 1)

  console.log(`Monkey business value: ${monkeyBusinessValue}`)
}

solution()
