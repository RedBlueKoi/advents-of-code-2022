export const a = 1

const input = await Deno.readTextFile('./input.txt')

interface Coordinates {
  x: number
  y: number
}

enum Direction {
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L',
  RIGHT = 'R'
}

const head: Coordinates = { x: 0, y: 0 }
const tail: Coordinates = { x: 0, y: 0 }
const visitedPositions: string[] = ['0,0']

const getDirectionIncrement = (direction: Direction) => {
  switch (direction) {
    case Direction.UP:
      return { x: 0, y: 1 }
    case Direction.DOWN:
      return { x: 0, y: -1 }
    case Direction.LEFT:
      return { x: -1, y: 0 }
    case Direction.RIGHT:
      return { x: 1, y: 0 }
  }
}

const moveHead = (directionIncrement: Coordinates) => {
  head.x += directionIncrement.x
  head.y += directionIncrement.y
}

const moveTail = () => {
  const { x: headX, y: headY } = head
  const { x: tailX, y: tailY } = tail
  // Same row/column movement
  if (headX === tailX) {
    tail.y += headY > tailY ? 1 : -1
    return
  }
  if (headY === tailY) {
    tail.x += headX > tailX ? 1 : -1
    return
  }
  // Diagonal movement
  tail.x += headX > tailX ? 1 : -1
  tail.y += headY > tailY ? 1 : -1
}

const areTouching = (): boolean => {
  const { x: headX, y: headY } = head
  const { x: tailX, y: tailY } = tail
  const xDiff = Math.abs(headX - tailX)
  const yDiff = Math.abs(headY - tailY)
  console.log(`Head: ${headX}, ${headY} | Tail: ${tailX}, ${tailY}`)
  if (xDiff <= 1 && yDiff <= 1) {
    console.log('Tail is close to head')
    return true
  }
  console.log('Tail should move!')
  return false
}

const updateHystory = () => {
  // Adding visited position to the list
  if (visitedPositions.includes(`${tail.x},${tail.y}`)) return
  visitedPositions.push(`${tail.x},${tail.y}`)
}

const processMove = (move: string) => {
  const [direction, steps] = move.split(' ')
  const directionValue = direction as Direction
  const stepsValue = parseInt(steps)

  const directionIncrement = getDirectionIncrement(directionValue)
  for (let index = 0; index < stepsValue; index++) {
    moveHead(directionIncrement)
    if (areTouching()) continue
    moveTail()
    updateHystory()
  }
}

const solution = () => {
  const moves = input.split('\n')
  moves.forEach(move => processMove(move))

  console.log('------------------')
  console.log(`Amount of visited positions: ${visitedPositions.length}`)
}

solution()
