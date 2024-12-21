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
var nextObstacles = []
// create grid and moves
var lineIndex = 1
reader.on('line', function (line, index) {
  var x = line.split(',')[0]
  var y = line.split(',')[1]

  if (lineIndex <= simulateUpUntil) {
    obstacles.push(y + '-' + x)
  } else {
    nextObstacles.push(y + '-' + x)
  }
  lineIndex++
})

reader.on('close', function () {
  // create grid
  var grid = createGrid(obstacles)

  // for each new obstacle check if it has a solution
  nextObstacles.forEach(function (newObstacle) {
    calculateShortestPath(grid, newObstacle)
  })
})

function calculateShortestPath(currentGrid, newObstacle) {
  var y = newObstacle.split('-')[0]
  var x = newObstacle.split('-')[1]
  currentGrid[y][x] = '#'

  var seen = new Set()
  var hasSolution = false
  // y-x, direction, count
  var queue = [[start, 0, []]]
  while (queue.length != 0) {
    // sort queue to take the lowest steps
    queue.sort((a, b) => {
      return a[1] - b[1] // second is count
    })

    // load values of the chosen lowest heap loss
    var currentqueue = queue.shift()
    var [position, count, path] = currentqueue
    var y = Number(position.split('-')[0])
    var x = Number(position.split('-')[1])

    // end
    if (position == end) {
      hasSolution = true
      break
    }

    if (seen.has(position)) continue
    seen.add(position)

    // positions of possible next moves (potential area)
    var left = y + '-' + (x - 1)
    var right = y + '-' + (x + 1)
    var top = y - 1 + '-' + x
    var bottom = y + 1 + '-' + x

    if (x - 1 >= 0) {
      if (currentGrid[y][x - 1] == pathCharacter && !seen.has(left)) {
        queue.push([left, count + 1, [...path, left]])
      }
    }

    if (x + 1 < width) {
      if (currentGrid[y][x + 1] == pathCharacter && !seen.has(right)) {
        queue.push([right, count + 1, [...path, right]])
      }
    }

    if (y - 1 >= 0) {
      if (currentGrid[y - 1][x] == pathCharacter && !seen.has(top)) {
        queue.push([top, count + 1, [...path, top]])
      }
    }

    if (y + 1 < height) {
      if (currentGrid[y + 1][x] == pathCharacter && !seen.has(bottom)) {
        queue.push([bottom, count + 1, [...path, bottom]])
      }
    }
  }
  if (!hasSolution) {
    console.log('does not have solution for: ' + newObstacle)
  }
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
