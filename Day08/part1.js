const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var lineLength = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var height = input.length / lineLength

var antennas = getAllAntennas(input)
var antinodePositions = []

antennas.forEach(function (positions, antennaType) {
  positions.forEach((currentAntennaPosition, index) => {
    for (let i = index; i < positions.length - 1; i++) {
      var nextAntennaPosition = positions[i + 1]

      // calculate column properties
      var currentColumn = currentAntennaPosition % lineLength
      var nextColumn = nextAntennaPosition % lineLength
      var columnSteps = Math.abs((currentAntennaPosition % lineLength) - (nextAntennaPosition % lineLength))
      var columnType = currentColumn > nextColumn ? 'nextLeft' : currentColumn == nextColumn ? 'same' : 'nextRight'

      // calculate row properties
      var currentRow = Math.floor(currentAntennaPosition / lineLength)
      var nextRow = Math.floor(nextAntennaPosition / lineLength)
      var rowSteps = nextRow - currentRow
      var rowType = currentRow == nextRow ? 'same' : 'nextDown'

      // based on properties find antinodes
      // types like nextLeftsame or samesame will never happen because we check top and left first against right
      switch (columnType + rowType) {
        case 'nextLeftnextDown':
          //console.log('nextLeftnextDown')
          // current will move right top
          // next move left down

          // outside for first antinode
          if (isRightMoveInside(currentColumn, columnSteps) && isTopMoveInside(currentRow, rowSteps)) {
            var antinodeColumn = currentColumn + columnSteps
            var antinodeRow = currentRow - rowSteps
            var antinodePosition = antinodeRow * lineLength + antinodeColumn
            antinodePositions.push(antinodePosition)
          }

          // outside for next antinode
          if (isLeftMoveInside(nextColumn, columnSteps) && isDownMoveInside(nextRow, rowSteps)) {
            var nextAntinodeColumn = nextColumn - columnSteps
            var nextAntinodeRow = nextRow + rowSteps
            var nextAntinodePosition = nextAntinodeRow * lineLength + nextAntinodeColumn
            antinodePositions.push(nextAntinodePosition)
          }

          break
        case 'samenextDown':
          //console.log('samenextDown')
          // current will move top
          // next will move down

          // outside for first antinode
          if (isTopMoveInside(currentRow, rowSteps)) {
            var antinodeColumn = currentColumn + columnSteps
            var antinodeRow = currentRow - rowSteps
            var antinodePosition = antinodeRow * lineLength + antinodeColumn
            antinodePositions.push(antinodePosition)
          }

          // outside for next antinode
          if (isDownMoveInside(nextRow, rowSteps)) {
            var nextAntinodeColumn = nextColumn - columnSteps
            var nextAntinodeRow = nextRow + rowSteps
            var nextAntinodePosition = nextAntinodeRow * lineLength + nextAntinodeColumn
            antinodePositions.push(nextAntinodePosition)
          }

          break
        case 'nextRightsame':
          //console.log('nextRightsame')
          // current will move left
          // next will move right

          // outside for first antinode
          if (isLeftMoveInside(currentColumn, columnSteps)) {
            var antinodeColumn = currentColumn - columnSteps
            var antinodeRow = currentRow - rowSteps
            var antinodePosition = antinodeRow * lineLength + antinodeColumn
            antinodePositions.push(antinodePosition)
          }

          // outside for next antinode
          if (isRightMoveInside(nextColumn, columnSteps)) {
            var nextAntinodeColumn = nextColumn + columnSteps
            var nextAntinodeRow = nextRow + rowSteps
            var nextAntinodePosition = nextAntinodeRow * lineLength + nextAntinodeColumn
            antinodePositions.push(nextAntinodePosition)
          }

          break
        case 'nextRightnextDown':
          //console.log('nextRightnextDown')
          // current will move left top
          // next will move right down

          // outside for first antinode
          if (isTopMoveInside(currentRow, rowSteps) && isLeftMoveInside(currentColumn, columnSteps)) {
            var antinodeColumn = currentColumn - columnSteps
            var antinodeRow = currentRow - rowSteps
            var antinodePosition = antinodeRow * lineLength + antinodeColumn
            antinodePositions.push(antinodePosition)
          }

          // outside for next antinode
          if (isDownMoveInside(nextRow, rowSteps) && isRightMoveInside(nextColumn, columnSteps)) {
            var nextAntinodeColumn = nextColumn + columnSteps
            var nextAntinodeRow = nextRow + rowSteps
            var nextAntinodePosition = nextAntinodeRow * lineLength + nextAntinodeColumn
            antinodePositions.push(nextAntinodePosition)
          }

          break
        default:
          console.error('This should not happen: ' + columnType + rowType)
          break
      }
    }
  })
})

console.log('unique positions of antinodes: ' + new Set(antinodePositions).size)
outputToConsole(input, lineLength)

function getAllAntennas(arr) {
  var antennas = new Map()
  for (i = 0; i < arr.length; i++) {
    if (arr[i] != '.') {
      if (antennas.has(arr[i])) {
        antennas.set(arr[i], [...antennas.get(arr[i]), i])
      } else {
        antennas.set(arr[i], [i])
      }
    }
  }
  return antennas
}

function outputToConsole(input, lineLength) {
  var out = ''
  input.forEach((value, index) => {
    var character = value
    if (antinodePositions.indexOf(index) != -1) {
      character = '#'
    }

    if (index % lineLength == 0 && index != 0) {
      // one line
      console.log(out)
      out = character
    } else {
      // middle of the line
      out = out + character
    }

    // last line
    if (index == input.length - 1) {
      console.log(out)
    }
  })
}

function isLeftMoveInside(column, steps) {
  if (column - steps < 0) return false
  return true
}

function isRightMoveInside(column, steps) {
  if (column + steps > lineLength - 1) return false
  return true
}

function isTopMoveInside(row, steps) {
  if (row - steps < 0) return false
  return true
}

function isDownMoveInside(row, steps) {
  if (row + steps >= height) return false
  return true
}
