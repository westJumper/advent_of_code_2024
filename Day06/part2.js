const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var height = input.length / width

var allNewObstacles = new Set()
var allVisitedPositions = new Set() // position with where the next step is after turn
var positionIndex = input.indexOf('^')
var startingGuardPosition = input.indexOf('^')
var direction = 'up'

// get out of a library and mark all visited positions and directions in those positions
while (positionIndex >= 0 && positionIndex < input.length && direction != 'outofmap') {
  var nextPositionIndex
  var nextDirection = direction
  //console.log(direction)
  // next step forward would be # so we turn right and continue
  switch (direction) {
    case 'right':
      nextCharacter = input[positionIndex + 1]
      if (nextCharacter == '#') {
        direction = 'down'
      }
      break
    case 'down':
      nextCharacter = input[positionIndex + width]
      if (nextCharacter == '#') {
        direction = 'left'
      }
      break
    case 'left':
      nextCharacter = input[positionIndex - 1]
      if (nextCharacter == '#') {
        direction = 'up'
      }
      break
    case 'up':
      nextCharacter = input[positionIndex - width]
      if (nextCharacter == '#') {
        direction = 'right'
      }
      break
    default:
      break
  }
  allVisitedPositions.add(positionIndex + '|' + direction)
  switch (direction) {
    case 'right':
      nextPositionIndex = positionIndex + 1
      break
    case 'down':
      nextPositionIndex = positionIndex + width
      break
    case 'left':
      nextPositionIndex = positionIndex - 1
      break
    case 'up':
      nextPositionIndex = positionIndex - width
      break
    default:
      console.error('Invalid direction: ' + direction)
  }

  // out of map
  if ((nextDirection == 'left' && positionIndex % width == 0) || (nextDirection == 'right' && positionIndex % width == width - 1)) {
    direction = 'outofmap'
  }

  // step to next position
  positionIndex = nextPositionIndex
}

// remove position where guard is starting from checking as there cannot be an obstacle
allVisitedPositions.delete(startingGuardPosition + '|up')
allVisitedPositions.delete(startingGuardPosition + '|right')
allVisitedPositions.delete(startingGuardPosition + '|down')
allVisitedPositions.delete(startingGuardPosition + '|left')
//console.log(allVisitedPositions)

// loop through all visited positions and update map to include a new obstacle and test if it loops
allVisitedPositions.forEach(function (position) {
  var currentPos = Number(position.split('|')[0])

  // place an obstacle on a visited position to simulate if it would create a loop
  var newInput = [...input]
  var newInputPosition = currentPos
  newInput[newInputPosition] = '#'

  // if new obstacle creates a loop add it to list of new obstacles
  if (isLoop(newInput, newInputPosition)) {
    allNewObstacles.add(newInputPosition)
  }
})

console.log(allNewObstacles.size)

function isLoop(newInput, addedObstaclePosition) {
  // cannot place obstacle on a starting guard position, that is a rule
  if (addedObstaclePosition == startingGuardPosition) return false

  // start from the beginning all the time as there may be loop there as well
  var direction = 'up'
  var positionIndex = input.indexOf('^')

  var allVisitedPositions = []
  while (positionIndex >= 0 && positionIndex < newInput.length && direction != 'outofmap') {
    if (allVisitedPositions.includes(positionIndex + '|' + direction)) {
      //console.log(newInput)
      //console.log(allVisitedPositions)
      return true
    } else {
      allVisitedPositions.push(positionIndex + '|' + direction)
    }

    var nextPositionIndex
    var nextDirection = direction

    // next step forward would be # so we turn right and continue, if not possible we turn right again
    switch (direction) {
      case 'right':
        if (newInput[positionIndex + 1] == '#') {
          direction = 'down'
          if (newInput[positionIndex + width] == '#') {
            direction = 'left'
          }
        }
        break
      case 'down':
        if (newInput[positionIndex + width] == '#') {
          direction = 'left'
          if (newInput[positionIndex - 1] == '#') {
            direction = 'up'
          }
        }
        break
      case 'left':
        if (newInput[positionIndex - 1] == '#') {
          direction = 'up'
          if (newInput[positionIndex - width] == '#') {
            direction = 'right'
          }
        }
        break
      case 'up':
        if (newInput[positionIndex - width] == '#') {
          direction = 'right'
          if (newInput[positionIndex + 1] == '#') {
            direction = 'down'
          }
        }
        break
      default:
        break
    }

    // go to a next direction
    switch (direction) {
      case 'right':
        nextPositionIndex = positionIndex + 1
        break
      case 'down':
        nextPositionIndex = positionIndex + width
        break
      case 'left':
        nextPositionIndex = positionIndex - 1
        break
      case 'up':
        nextPositionIndex = positionIndex - width
        break
      default:
        console.error('Invalid direction 1: ' + direction)
    }

    // out of map
    if ((nextDirection == 'left' && positionIndex % width == 0) || (nextDirection == 'right' && positionIndex % width == width - 1)) {
      direction = 'outofmap'
      return false
    }

    // step to next position
    positionIndex = nextPositionIndex
  }
}

// for visualisation
var line = ''
var char = ''
for (let i = 0; i <= height * width; i++) {
  if (i % width == 0) {
    console.log(line)
    line = ''
  }
  if (allNewObstacles.has(i)) {
    char = 'o'
  } else {
    char = input[i]
  }
  line = line + char
}
