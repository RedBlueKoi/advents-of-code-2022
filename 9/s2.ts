export const a = 1

const input = await Deno.readTextFile('./input.txt')
// const input = await Deno.readTextFile('./test.txt')

interface Coordinates {
  x: number
  y: number
}

interface Point {
  id: number
  coordinates: Coordinates
  prev: Point | null
  next: Point | null
}

interface Snake {
  head: Point
}

enum Direction {
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L',
  RIGHT = 'R'
}

const snakeSize = 9
const visitedPositions: string[] = ['0,0']

const generateSnake = (): Snake => {
  const head: Point = {
    id: 0,
    coordinates: { x: 0, y: 0 },
    prev: null,
    next: null
  }
  const snake: Snake = { head }
  let prevPoint = head
  for (let index = 0; index < snakeSize; index++) {
    const point = {
      id: index + 1,
      coordinates: { x: 0, y: 0 },
      prev: prevPoint,
      next: null
    }
    prevPoint.next = point
    prevPoint = point
  }
  console.log('-------------------')
  console.log('Snake generated')
  let whilePoint: Point | null = snake.head
  while (whilePoint) {
    console.log(
      `Point ${whilePoint.id} | ${whilePoint.coordinates.x}, ${whilePoint.coordinates.y}`
    )
    whilePoint = whilePoint.next
  }
  console.log('-------------------')
  return snake
}

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
  snake.head.coordinates.x += directionIncrement.x
  snake.head.coordinates.y += directionIncrement.y
}

interface Segment {
  head: Point
  tail: Point
}
const moveTail = (props: Segment) => {
  const { head, tail } = props
  const { x: headX, y: headY } = head.coordinates
  const { x: tailX, y: tailY } = tail.coordinates
  // Same row/column movement
  if (headX === tailX) {
    tail.coordinates.y += headY > tailY ? 1 : -1
    return
  }
  if (headY === tailY) {
    tail.coordinates.x += headX > tailX ? 1 : -1
    return
  }
  // Diagonal movement
  tail.coordinates.x += headX > tailX ? 1 : -1
  tail.coordinates.y += headY > tailY ? 1 : -1
}

const areTouching = (props: Segment): boolean => {
  const { head, tail } = props
  const { x: headX, y: headY } = head.coordinates
  const { x: tailX, y: tailY } = tail.coordinates
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

const updateHystory = (tail: Point) => {
  // Adding visited position to the list
  const { x, y } = tail.coordinates
  if (visitedPositions.includes(`${x},${y}`)) return
  visitedPositions.push(`${x},${y}`)
}

const processMove = (move: string) => {
  const [direction, steps] = move.split(' ')
  const directionValue = direction as Direction
  const stepsValue = parseInt(steps)

  const directionIncrement = getDirectionIncrement(directionValue)
  for (let index = 0; index < stepsValue; index++) {
    moveHead(directionIncrement)
    // moving the body
    let tail = snake.head.next
    while (tail) {
      if (!tail.prev) break
      if (areTouching({ head: tail.prev, tail })) break
      moveTail({ head: tail.prev, tail })

      if (tail.next === null) updateHystory(tail)
      tail = tail.next
    }
  }
}

const snake = generateSnake()
const solution = () => {
  const moves = input.split('\n')
  moves.forEach(move => processMove(move))

  console.log('------------------')
  console.log(`Amount of visited positions: ${visitedPositions.length}`)
}

solution()
