const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var height = input.length / width

//console.log(input)
//console.log('width: ' + width)
//console.log('height: ' + height)

var allVisitedPositions = new Set()
var uniqueVisitedPositions = []

var startingPoints = [{ positionIndex: input.indexOf('^'), direction: 'up' }]

for (let i = 0; i < startingPoints.length; i++) {
  //console.log('--------------------------')
  //console.log(i)
  //console.log(startingPoints.length)
  // console.log('processing starting point: ' + JSON.stringify(startingPoints[i]))
  // console.log('all starting points: ' + JSON.stringify(startingPoints))
  var positionIndex = startingPoints[i].positionIndex
  var direction = startingPoints[i].direction

  allVisitedPositions.add(positionIndex + direction)
  if (uniqueVisitedPositions.indexOf(positionIndex) == -1) uniqueVisitedPositions.push(positionIndex)

  while (positionIndex >= 0 && positionIndex < input.length && direction != 'outofmap') {
    allVisitedPositions.add(positionIndex + direction)
    if (uniqueVisitedPositions.indexOf(positionIndex) == -1) uniqueVisitedPositions.push(positionIndex)
    //console.log(allVisitedPositions)

    //console.log('current position: ' + positionIndex + ' direction to: ' + direction + ' char: ' + input[positionIndex])
    var nextPositionIndex
    var nextDirection = direction

    // next step forward would be # so we turn right and continue
    switch (direction) {
      case 'right':
        nextCharacter = input[positionIndex + 1]
        if (nextCharacter == '#') direction = 'down'
        break
      case 'down':
        nextCharacter = input[positionIndex + width]
        if (nextCharacter == '#') direction = 'left'
        break
      case 'left':
        nextCharacter = input[positionIndex - 1]
        if (nextCharacter == '#') direction = 'up'
        break
      case 'up':
        nextCharacter = input[positionIndex - width]
        if (nextCharacter == '#') direction = 'right'
        break
      default:
        break
    }

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

    //console.log('next direction: ' + nextDirection)
    //console.log('next position index: ' + nextPositionIndex)
    positionIndex = nextPositionIndex
  }
}

console.log(uniqueVisitedPositions.length)

// Next part is only for visualisation

//console.log('all visited positions: ' + allVisitedPositions.size)
//console.log(allVisitedPositions)
var line = ''
var char = ''
for (let i = 0; i <= height * width; i++) {
  if (i % width == 0) {
    console.log(line)
    line = ''
  }
  if (uniqueVisitedPositions.indexOf(i) != -1) {
    char = 'o'
  } else {
    char = input[i]
  }
  line = line + char
}
