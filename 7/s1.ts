export const a = 1

const input = await Deno.readTextFile('./input.txt')
const terminalLines = input.split('\n')
terminalLines.shift()

interface File {
  size: number
  name: string
}
interface Directory {
  size: number
  name: string
  directories: Directory[]
  files: File[]
}

const path = ['/']
const maxSize = 100000
const directories: Directory[] = [
  {
    size: 0,
    name: '/',
    directories: [],
    files: []
  }
]

type InputCommand = 'cd' | 'ls'

interface InputProps {
  command: InputCommand
  dir?: string
}

const getCurrentDirectory = () => {
  const currentDirectory = path.reduce(
    (acc: Directory | undefined, pathPart: string) => {
      if (pathPart === '/') return directories[0]
      if (!acc) return
      return acc.directories.find(d => d.name === pathPart)
    },
    undefined
  )
  return currentDirectory
}

const processInput = ({ command, dir }: InputProps) => {
  if (command === 'ls' || !dir) return
  if (dir === '..') {
    path.pop()
  } else {
    path.push(dir)
  }
}

const processDirectory = (name: string) => {
  const currentDirectory = getCurrentDirectory()
  if (!currentDirectory) return
  if (currentDirectory.directories.find(dir => dir.name === name)) return
  currentDirectory.directories.push({
    size: 0,
    name,
    directories: [],
    files: []
  })
}

const processFile = (size: number, name: string) => {
  const currentDirectory = getCurrentDirectory()
  if (!currentDirectory) return
  currentDirectory.files.push({ size, name })
}

const getDirectorySize = (directory: Directory) => {
  let size = 0
  directory.files.forEach(file => (size += file.size))
  directory.directories.forEach(dir => {
    dir.size = getDirectorySize(dir)
    return (size += dir.size)
  })
  return size
}

const findBigDirectories = (directory: Directory): Directory[] => {
  let bigDirectories: Directory[] = []
  if (directory.size < maxSize) bigDirectories.push(directory)
  directory.directories.forEach(dir => {
    bigDirectories = [...bigDirectories, ...findBigDirectories(dir)]
  })
  return bigDirectories
}

const solution = () => {
  while (terminalLines.length > 0) {
    const line = terminalLines.shift()
    if (!line) break
    const parsedLine = line.split(' ')
    switch (parsedLine[0]) {
      case '$': {
        const command = parsedLine[1] as InputCommand
        processInput({ command, dir: parsedLine[2] })
        break
      }
      case 'dir': {
        const name = parsedLine[1]
        processDirectory(name)
        break
      }
      default: {
        const [size, fileName] = parsedLine
        processFile(parseInt(size), fileName)
        break
      }
    }
  }

  const rootDirectory = directories[0]
  rootDirectory.size = getDirectorySize(rootDirectory)

  const bigDirectories = findBigDirectories(rootDirectory)
  console.log(
    'Total sum: ',
    bigDirectories.reduce((acc, dir) => acc + dir.size, 0)
  )
}

solution()
