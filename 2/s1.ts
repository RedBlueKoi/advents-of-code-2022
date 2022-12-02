export const a = 1

const input = await Deno.readTextFile('./input.txt')
const games = input.split('\n')

enum Result {
  LOSS = 0,
  DRAW = 3,
  WIN = 6
}

enum MoveValue {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3
}

enum MyMove {
  X = MoveValue.PAPER,
  Y = MoveValue.ROCK,
  Z = MoveValue.SCISSORS
}
type MyMoveType = keyof typeof MyMove

enum OpponentMove {
  A = MoveValue.ROCK,
  B = MoveValue.PAPER,
  C = MoveValue.SCISSORS
}
type OpponentMoveType = keyof typeof OpponentMove

const checkCondition = (move: number, opponentMove: number): number => {
  const diff = move - opponentMove
  if (diff === 0) return Result.DRAW
  if (diff === 1 || diff === -2) return Result.WIN
  return Result.LOSS
}

const solution = () => {
  const finalScore = games.reduce((acc, game) => {
    const [opponentMove, myMove] = game.split(' ') as [
      OpponentMoveType,
      MyMoveType
    ]
    const opponentMoveValue = OpponentMove[opponentMove]
    const myMoveValue = MyMove[myMove]
    const gameResult = checkCondition(myMoveValue, opponentMoveValue)

    return acc + gameResult + myMoveValue
  }, 0)

  console.log({ finalScore })
}

solution()
