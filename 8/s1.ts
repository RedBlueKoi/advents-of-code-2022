export const a = 1

const input = await Deno.readTextFile('./input.txt')

enum Direction {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right'
}
interface Tree {
  height: number
  visibleDirections: Direction[]
}

class Forest extends Array<Tree[]> {
  constructor() {
    super()
  }

  addRow = (row: string) => {
    this.push(this.processRow(row))
  }

  private processRow = (row: string): Tree[] => {
    return row.split('').map(tree => ({
      height: parseInt(tree),
      visibleDirections: []
    }))
  }

  private rotateRight = (forest: Tree[][]): Tree[][] => {
    return forest.map((_, index) => forest.map(row => row[index]).reverse())
  }

  private rotateLeft = (forest: Tree[][]): Tree[][] => {
    return forest.map((_, index) =>
      forest.map(row => row[row.length - 1 - index])
    )
  }

  private isTallestInRow = (tree: Tree, row: Tree[]): boolean => {
    return row.every(t => tree.height > t.height)
  }

  private checkFromLeft = (row: Tree[]): Tree[] => {
    return row.map((tree, index) => {
      const previousRow = row.slice(0, index)
      if (this.isTallestInRow(tree, previousRow)) {
        tree.visibleDirections.push(Direction.LEFT)
      }
      return tree
    })
  }

  private checkFromRight = (row: Tree[]): Tree[] => {
    return row
      .reverse()
      .map((tree, index) => {
        const previousRow = row.slice(0, index)
        if (this.isTallestInRow(tree, previousRow)) {
          tree.visibleDirections.push(Direction.RIGHT)
        }
        return tree
      })
      .reverse()
  }

  private checkFromTop = (row: Tree[]): Tree[] => {
    return row.map((tree, index) => {
      const previousRow = row.slice(0, index)
      if (this.isTallestInRow(tree, previousRow)) {
        tree.visibleDirections.push(Direction.TOP)
      }
      return tree
    })
  }

  private checkFromBottom = (row: Tree[]): Tree[] => {
    return row
      .reverse()
      .map((tree, index) => {
        const previousRow = row.slice(0, index)
        if (this.isTallestInRow(tree, previousRow)) {
          tree.visibleDirections.push(Direction.BOTTOM)
        }
        return tree
      })
      .reverse()
  }

  checkVisibleTrees() {
    let result = []
    result = this.map(row => this.checkFromLeft(row)).map(row =>
      this.checkFromRight(row)
    )
    result = this.rotateLeft(result)
    result = result.map(row => this.checkFromTop(row))
    result = result.map(row => this.checkFromBottom(row))
    result = this.rotateRight(result)
    return result
  }

  getVisibleTrees = (): number => {
    return this.reduce((acc, row) => {
      const visible = row.filter(tree => !!tree.visibleDirections.length)
      return acc + visible.length
    }, 0)
  }
}

const solution = () => {
  const lines = input.split('\n')
  const forest = new Forest()
  lines.forEach(line => forest.addRow(line))
  forest.checkVisibleTrees()
  console.log(forest.getVisibleTrees())
}

solution()
