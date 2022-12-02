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

enum ExpectedGameResult {
  X = Result.LOSS,
  Y = Result.DRAW,
  Z = Result.WIN
}
type ExpectedGameResultType = keyof typeof ExpectedGameResult

enum OpponentMove {
  A = MoveValue.ROCK,
  B = MoveValue.PAPER,
  C = MoveValue.SCISSORS
}
type OpponentMoveType = keyof typeof OpponentMove

const calculateMove = (
  opponentMove: OpponentMoveType,
  expectedResult: ExpectedGameResultType
): number => {
  const opponentMoveValue = OpponentMove[opponentMove]
  const expectedResultValue = ExpectedGameResult[expectedResult]
  switch (expectedResultValue) {
    case ExpectedGameResult.X:
      return opponentMoveValue === 1 ? 3 : opponentMoveValue - 1
    case ExpectedGameResult.Y:
      return opponentMoveValue
    case ExpectedGameResult.Z:
      return (opponentMoveValue % 3) + 1

    default:
      return -1
  }
}

const solution = () => {
  const finalScore = games.reduce((acc, game) => {
    const [opponentMove, expectedResult] = game.split(' ') as [
      OpponentMoveType,
      ExpectedGameResultType
    ]
    const move = calculateMove(opponentMove, expectedResult)
    return acc + move + ExpectedGameResult[expectedResult]
  }, 0)

  console.log({ finalScore })
}

solution()
