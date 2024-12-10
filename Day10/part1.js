// original code is from https://github.com/westJumper/advent_of_code_2022/blob/main/Day%2012/Day12.js

const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

// parse input
var grid = []
var startNumber = 0
var endNumber = 9
var identifier = 1 // important, if trailhead splits and meets again we count is as 1 route
var visitedPositions = []
var queue = []

// create grid and set starting position
reader.on('line', function (line) {
  var lineCharacters = line.split('')
  var lineCharactersNumbers = lineCharacters.map(function (character, index) {
    if (character == startNumber) {
      visitedPositions.push({
        y: grid.length,
        x: index,
        height: 0,
        trailheadId: identifier,
      })
      queue.push({
        y: grid.length,
        x: index,
        height: 0,
        trailheadId: identifier,
      })
      identifier++
      return 0
    }
    if (character == '.') return '.'
    return Number(character)
  })
  grid.push(lineCharactersNumbers)
})

// after file is read through
reader.on('close', function () {
  var temporaryQueue = []
  var reachedTop = 0

  // travel until no possible step
  while (queue.length > 0) {
    var route = queue.shift()
    var currentPositionX = route.x
    var currentPositionY = route.y
    var currentPositionHeight = grid[currentPositionY][currentPositionX]
    var trailheadId = route.trailheadId

    // find all neighbours of current node we can go to
    var nextPossiblePositions = []
    // left and right
    if (currentPositionX == 0) {
      // move only right
      if (grid[currentPositionY][currentPositionX + 1] == currentPositionHeight + 1) {
        nextPossiblePositions.push({
          y: currentPositionY,
          x: currentPositionX + 1,
          height: grid[currentPositionY][currentPositionX + 1],
          trailheadId,
        })
      }
    } else if (currentPositionX == grid[0].length - 1) {
      if (grid[currentPositionY][currentPositionX - 1] == currentPositionHeight + 1) {
        // move only left
        nextPossiblePositions.push({
          y: currentPositionY,
          x: currentPositionX - 1,
          height: grid[currentPositionY][currentPositionX - 1],
          trailheadId,
        })
      }
    } else {
      // move right
      if (grid[currentPositionY][currentPositionX + 1] == currentPositionHeight + 1) {
        nextPossiblePositions.push({
          y: currentPositionY,
          x: currentPositionX + 1,
          height: grid[currentPositionY][currentPositionX + 1],
          trailheadId,
        })
      }
      if (grid[currentPositionY][currentPositionX - 1] == currentPositionHeight + 1) {
        // move left
        nextPossiblePositions.push({
          y: currentPositionY,
          x: currentPositionX - 1,
          height: grid[currentPositionY][currentPositionX - 1],
          trailheadId,
        })
      }
    }

    // up and down
    if (currentPositionY == 0) {
      // move only up
      if (grid[currentPositionY + 1][currentPositionX] == currentPositionHeight + 1) {
        nextPossiblePositions.push({
          y: currentPositionY + 1,
          x: currentPositionX,
          height: grid[currentPositionY + 1][currentPositionX],
          trailheadId,
        })
      }
    } else if (currentPositionY == grid.length - 1) {
      // move only down
      if (grid[currentPositionY - 1][currentPositionX] == currentPositionHeight + 1) {
        nextPossiblePositions.push({
          y: currentPositionY - 1,
          x: currentPositionX,
          height: grid[currentPositionY - 1][currentPositionX],
          trailheadId,
        })
      }
    } else {
      // move only up
      if (grid[currentPositionY + 1][currentPositionX] == currentPositionHeight + 1) {
        nextPossiblePositions.push({
          y: currentPositionY + 1,
          x: currentPositionX,
          height: grid[currentPositionY + 1][currentPositionX],
          trailheadId,
        })
      }
      // move only down
      if (grid[currentPositionY - 1][currentPositionX] == currentPositionHeight + 1) {
        nextPossiblePositions.push({
          y: currentPositionY - 1,
          x: currentPositionX,
          height: grid[currentPositionY - 1][currentPositionX],
          trailheadId,
        })
      }
    }

    //remove positions that were already visited (from the same trailhead)
    nextPossiblePositions = nextPossiblePositions.filter(function (position) {
      return !visitedPositions.some(function (visitedPosition) {
        return visitedPosition.x == position.x && visitedPosition.y == position.y && visitedPosition.trailheadId == position.trailheadId
      })
    })

    // add to visited positions and temporary queue
    nextPossiblePositions.forEach(function (position) {
      visitedPositions.push(position)
      temporaryQueue.push(position)
    })

    // if queue is empty we go to next step (new array of neighbours)
    if (queue.length == 0) {
      // if there is a finish in temporary queue we found the number of minimum steps to reach it
      temporaryQueue.forEach(function (position) {
        if (position.height == endNumber) {
          reachedTop++
        } else {
          queue.push(position)
        }
      })

      temporaryQueue = []
    }
  }

  console.log('Reached top: ' + reachedTop)
})
