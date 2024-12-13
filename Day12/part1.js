const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

// parse input
var grid = []
var remainingPositions = []
var totalPrice = 0

// create grid and set starting position
reader.on('line', function (line) {
  var lineCharacters = line.split('')
  var lineCharactersNumbers = lineCharacters.map(function (character, index) {
    remainingPositions.push(grid.length + '-' + index + '-' + character)
    return character
  })
  grid.push(lineCharactersNumbers)
})

// after file is read through
reader.on('close', function () {
  // travel until no possible step
  while (remainingPositions.length > 0) {
    // find all neighbours area with the same character
    var visitedInArea = []
    var perimeter = 0
    var availableMovesInSameArea = [remainingPositions.shift()]
    var currentAreaCharacter = availableMovesInSameArea[0].split('-')[2]

    while (availableMovesInSameArea.length > 0) {
      var route = availableMovesInSameArea.shift()
      var currentPositionY = Number(route.split('-')[0])
      var currentPositionX = Number(route.split('-')[1])

      visitedInArea.push(route) // add current to current area
      // if it is still in not visited remove it as we just visited it
      if (remainingPositions.indexOf(route) != -1) {
        remainingPositions.splice(remainingPositions.indexOf(route), 1)
      }

      // positions of possible next moves (potential area)
      var left = currentPositionY + '-' + (currentPositionX - 1) + '-' + currentAreaCharacter
      var right = currentPositionY + '-' + (currentPositionX + 1) + '-' + currentAreaCharacter
      var top = currentPositionY - 1 + '-' + currentPositionX + '-' + currentAreaCharacter
      var bottom = currentPositionY + 1 + '-' + currentPositionX + '-' + currentAreaCharacter

      var availableDirections = [left, right, top, bottom]

      availableDirections.forEach(function (position) {
        // move is not possible there (point not exist or is part of area)
        // add perimeter in case not part of area
        if (!remainingPositions.includes(position) && !visitedInArea.includes(position)) {
          perimeter++ // this position was not yet visited and is not to be visited -> add fence
        }
        if (!remainingPositions.includes(position)) return // we cannot go there

        if (!availableMovesInSameArea.includes(position)) availableMovesInSameArea.push(position)

        return
      })

      if (availableMovesInSameArea.length == 0) {
        console.log('region ' + currentAreaCharacter + ' has price ' + visitedInArea.length + ' * ' + perimeter + ' = ' + visitedInArea.length * perimeter)
        totalPrice = totalPrice + visitedInArea.length * perimeter
      }
    }
  }
  console.log(totalPrice)
})
