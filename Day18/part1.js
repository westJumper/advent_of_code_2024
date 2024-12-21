const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var width = 71
var height = 71
var start = '0-0'
var end = '70-70'
var simulateUpUntil = 1024
var pathCharacter = '.'

if (inputFile == 'test.txt') {
  width = 7
  height = 7
  start = '0-0'
  end = '6-6'
  simulateUpUntil = 12
}

// parse input
var obstacles = []
var grid = []
// create grid and moves
var lineIndex = 1
reader.on('line', function (line, index) {
  var x = line.split(',')[0]
  var y = line.split(',')[1]

  if (lineIndex <= simulateUpUntil) {
    obstacles.push(y + '-' + x)
  }
  lineIndex++
})

reader.on('close', function () {
  // create grid
  const grid = createGrid(obstacles)

  // indexes of those positions
  var seen = new Set()

  // y-x, direction, count
  var queue = [[start, 0]]

  while (queue.length != 0) {
    // sort queue to take the lowest steps
    queue.sort((a, b) => {
      return a[1] - b[1] // second is count
    })

    // load values of the chosen lowest heap loss
    var currentqueue = queue.shift()
    var [position, count, character] = currentqueue
    var y = Number(position.split('-')[0])
    var x = Number(position.split('-')[1])

    // end
    if (position == end) {
      console.log('end path steps: ' + count)
      break
    }

    // we have seen this already, skip processing
    if (seen.has(position)) continue

    // add to seen
    seen.add(position)

    // positions of possible next moves (potential area)
    var left = y + '-' + (x - 1)
    var right = y + '-' + (x + 1)
    var top = y - 1 + '-' + x
    var bottom = y + 1 + '-' + x

    if (x - 1 >= 0) {
      if (grid[y][x - 1] == pathCharacter && !seen.has(left)) {
        queue.push([left, count + 1])
      }
    }

    if (x + 1 < width) {
      if (grid[y][x + 1] == pathCharacter && !seen.has(right)) {
        queue.push([right, count + 1])
      }
    }

    if (y - 1 >= 0) {
      if (grid[y - 1][x] == pathCharacter && !seen.has(top)) {
        queue.push([top, count + 1])
      }
    }

    if (y + 1 < height) {
      if (grid[y + 1][x] == pathCharacter && !seen.has(bottom)) {
        queue.push([bottom, count + 1])
      }
    }
  }
})

function showGrid(visited) {
  var result = 0
  for (let index = 0; index < grid.length; index++) {
    const yp = index
    var line = []
    for (let index = 0; index < grid[0].length; index++) {
      const xp = index
      var char = grid[yp][xp]
      if (visited.has(yp + '-' + xp)) {
        char = 'O'
      }
      line.push(char)
    }
    console.log(line.join(''))
  }
  return result
}

function createGrid(obstacles) {
  var grid = []
  for (let index = 0; index < height; index++) {
    const yp = index
    var line = []
    for (let index = 0; index < width; index++) {
      const xp = index
      var char = '.'
      if (obstacles.includes(yp + '-' + xp)) {
        char = '#'
      }
      line.push(char)
    }
    grid.push(line)
    console.log(line.join(''))
  }
  return grid
}
