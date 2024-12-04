const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()
var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var height = input.length / width
var xmassCounter = 0

// get starting positions for X
var potentialXmassStartPositions = []
input.forEach(function (letter, indexPosition) {
  if (letter == 'X') potentialXmassStartPositions.push(indexPosition)
})

// for each position of X check if it has xmass in 8 different directions
potentialXmassStartPositions.forEach(function (startingPosition) {
  if (isXmasRight(startingPosition)) xmassCounter++
  if (isXmasLeft(startingPosition)) xmassCounter++
  if (isXmasTop(startingPosition)) xmassCounter++
  if (isXmasBottom(startingPosition)) xmassCounter++
  if (isXmasLeftTop(startingPosition)) xmassCounter++
  if (isXmasRightTop(startingPosition)) xmassCounter++
  if (isXmasLeftBottom(startingPosition)) xmassCounter++
  if (isXmasRightBottom(startingPosition)) xmassCounter++
})

console.log(xmassCounter)

function isXmasRight(currentPosition) {
  if ((currentPosition % width) + 3 >= width) return false // does not fit one line (position of a letter X + 4 letters is more then line width)
  if (input.slice(currentPosition, currentPosition + 4).join('') != 'XMAS') return false // does not contain XMAS
  return true
}

function isXmasLeft(currentPosition) {
  if ((currentPosition % width) - 3 < 0) return false
  if (input.slice(currentPosition - 3, currentPosition + 1).join('') != 'SAMX') return false // because starting position is on the left
  return true
}

function isXmasTop(currentPosition) {
  if (currentPosition - 3 * width < 0) return false
  //console.log(input[currentPosition] + input[currentPosition - width] + input[currentPosition - width - width] + input[currentPosition - width - width - width])
  if (input[currentPosition] + input[currentPosition - width] + input[currentPosition - width - width] + input[currentPosition - width - width - width] != 'XMAS') return false
  return true
}
function isXmasBottom(currentPosition) {
  if (currentPosition + 3 * width > input.length) return false
  //console.log(input[currentPosition] + input[currentPosition + width] + input[currentPosition + width + width] + input[currentPosition + width + width + width])
  if (input[currentPosition] + input[currentPosition + width] + input[currentPosition + width + width] + input[currentPosition + width + width + width] != 'XMAS') return false
  return true
}

function isXmasLeftTop(currentPosition) {
  if ((currentPosition % width) - 3 < 0 || currentPosition - width - width - width - 3 < 0) return false
  //console.log(input[currentPosition] + input[currentPosition - width - 1] + input[currentPosition - width - width - 2] + input[currentPosition - width - width - width - 3])
  if (input[currentPosition] + input[currentPosition - width - 1] + input[currentPosition - width - width - 2] + input[currentPosition - width - width - width - 3] != 'XMAS') return false
  return true
}

function isXmasRightTop(currentPosition) {
  if ((currentPosition % width) + 3 >= width || currentPosition - width - width - width + 3 < 0) return false
  //console.log(input[currentPosition] + input[currentPosition - width + 1] + input[currentPosition - width - width + 2] + input[currentPosition - width - width - width + 3])
  if (input[currentPosition] + input[currentPosition - width + 1] + input[currentPosition - width - width + 2] + input[currentPosition - width - width - width + 3] != 'XMAS') return false
  return true
}

function isXmasLeftBottom(currentPosition) {
  if ((currentPosition % width) - 3 < 0 || currentPosition + width + width + width - 3 > input.length) return false
  //console.log(input[currentPosition] + input[currentPosition + width - 1] + input[currentPosition + width + width - 2] + input[currentPosition + width + width + width - 3])
  if (input[currentPosition] + input[currentPosition + width - 1] + input[currentPosition + width + width - 2] + input[currentPosition + width + width + width - 3] != 'XMAS') return false
  return true
}

function isXmasRightBottom(currentPosition) {
  if ((currentPosition % width) + 3 >= width || currentPosition + width + width + width + 3 > input.length) return false
  //console.log(input[currentPosition] + input[currentPosition + width + 1] + input[currentPosition + width + width + 2] + input[currentPosition + width + width + width + 3])
  if (input[currentPosition] + input[currentPosition + width + 1] + input[currentPosition + width + width + 2] + input[currentPosition + width + width + width + 3] != 'XMAS') return false
  return true
}
