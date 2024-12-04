const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()
var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var xmassCounter = 0

// get starting positions for X
var potentialXmassStartPositions = []
input.forEach(function (letter, indexPosition) {
  if (letter == 'M') potentialXmassStartPositions.push(indexPosition)
})

// for each position of X check if it has xmass in 8 different directions
var centersOfWord = []
potentialXmassStartPositions.forEach(function (startingPosition) {
  // all return either -1 if not match or position of a center of word that matches
  centersOfWord.push(isXmasLeftTop(startingPosition))
  centersOfWord.push(isXmasRightTop(startingPosition))
  centersOfWord.push(isXmasLeftBottom(startingPosition))
  centersOfWord.push(isXmasRightBottom(startingPosition))
})

// filter out -1 as that is not a match
var centersOfWord = centersOfWord.filter(function (position) {
  if (position == -1) return false
  return true
})

// count occurences of middle points (position is key, value is occurences)
var counts = []
centersOfWord.forEach(function (position) {
  counts[position] = (counts[position] || 0) + 1
})

// count how many occurences cross each other
counts.forEach(function (occurences) {
  if (occurences == 2) xmassCounter++
})

// result
console.log(xmassCounter)

function isXmasLeftTop(currentPosition) {
  if ((currentPosition % width) - 2 < 0 || currentPosition - width - width - 2 < 0) return -1
  //console.log(input[currentPosition] + input[currentPosition - width - 1] + input[currentPosition - width - width - 2])
  if (input[currentPosition] + input[currentPosition - width - 1] + input[currentPosition - width - width - 2] != 'MAS') return -1
  return currentPosition - width - 1
}

function isXmasRightTop(currentPosition) {
  if ((currentPosition % width) + 2 >= width || currentPosition - width - width + 2 < 0) return -1
  //console.log(input[currentPosition] + input[currentPosition - width + 1] + input[currentPosition - width - width + 2] + input[currentPosition - width - width - width + 3])
  if (input[currentPosition] + input[currentPosition - width + 1] + input[currentPosition - width - width + 2] != 'MAS') return -1
  return currentPosition - width + 1
}

function isXmasLeftBottom(currentPosition) {
  if ((currentPosition % width) - 2 < 0 || currentPosition + width + width - 2 > input.length) return -1
  //console.log(input[currentPosition] + input[currentPosition + width - 1] + input[currentPosition + width + width - 2] + input[currentPosition + width + width + width - 3])
  if (input[currentPosition] + input[currentPosition + width - 1] + input[currentPosition + width + width - 2] != 'MAS') return -1
  return currentPosition + width - 1
}

function isXmasRightBottom(currentPosition) {
  if ((currentPosition % width) + 2 >= width || currentPosition + width + width + 2 > input.length) return -1
  //console.log(input[currentPosition] + input[currentPosition + width + 1] + input[currentPosition + width + width + 2] + input[currentPosition + width + width + width + 3])
  if (input[currentPosition] + input[currentPosition + width + 1] + input[currentPosition + width + width + 2] != 'MAS') return -1
  return currentPosition + width + 1
}
