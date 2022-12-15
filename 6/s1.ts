export const a = 1

const input = await Deno.readTextFile('./input.txt')

const shouldContinue = (buffer: string[]) => {
  if (buffer.length < 4) return true
  if (new Set(buffer).size !== buffer.length) return true

  return false
}

const solution = () => {
  const buffer: string[] = []
  let index = 0

  while (shouldContinue(buffer) && index < input.length - 1) {
    if (buffer.length === 4) buffer.shift()
    index++
    const char = input.charAt(index)
    buffer.push(char)
  }

  console.log(index + 1)
}

solution()
