export const a = 1

interface Tree {
  height: number
  visible: number[]
  scenicScore: number
}

const input = await Deno.readTextFile('./input.txt')
const trees: Tree[][] = input
  .split('\n')
  .map(line => line.split(''))
  .map(row =>
    row.map(tree => ({
      height: parseInt(tree),
      visible: [],
      scenicScore: 0
    }))
  )

const solution = () => {
  // console.log(trees)

  let result = trees.map(row => {
    return row.map((tree, index) => {
      const onRight = row.slice(index + 1)
      const onLeft = row.slice(0, index).reverse()
      const rightIndex = onRight.findIndex(t => t.height >= tree.height)
      const leftIndex = onLeft.findIndex(t => t.height >= tree.height)
      const visibleToRight = rightIndex === -1 ? onRight.length : rightIndex + 1
      const visibleToLeft = leftIndex === -1 ? onLeft.length : leftIndex + 1
      tree.visible.push(visibleToRight, visibleToLeft)
      return tree
    })
  })

  result = result.map((_, index) => result.map(row => row[index]).reverse())

  result = result.map(row => {
    return row.map((tree, index) => {
      const onRight = row.slice(index + 1)
      const onLeft = row.slice(0, index).reverse()
      const rightIndex = onRight.findIndex(t => t.height >= tree.height)
      const leftIndex = onLeft.findIndex(t => t.height >= tree.height)
      const visibleToRight = rightIndex === -1 ? onRight.length : rightIndex + 1
      const visibleToLeft = leftIndex === -1 ? onLeft.length : leftIndex + 1
      tree.visible.push(visibleToRight, visibleToLeft)
      return tree
    })
  })

  const theMostScenic = result.reduce((acc, row) => {
    const topInRow = row.reduce((acc, tree) => {
      const score = tree.visible.reduce((acc, v) => acc * v, 1)
      return score > acc ? score : acc
    }, 0)
    return acc < topInRow ? topInRow : acc
  }, 0)

  console.log(`The score of the most scenic tree: ${theMostScenic}`)
}

solution()
