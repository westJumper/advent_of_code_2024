const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var safeCount = 0

// load lists
reader.on('line', function (line) {
  var report = line.split(' ')
  //console.log(report)
  var safeResult = checkSafe(report)
  if (safeResult == -1) {
    safeCount = safeCount + 1
  } else {
    // if not safe try remove previous, current and next and test all for safety, if one of them is correct it is safe
    // previous is because of increase/decrease of first, for example 48 46 47 49 51 54 56
    var reportZero = [...report]
    var reportOne = [...report]
    var reportTwo = [...report]
    reportZero.splice(safeResult - 1, 1)
    reportOne.splice(safeResult, 1)
    reportTwo.splice(safeResult + 1, 1)
    if (
      checkSafe(reportZero) == -1 ||
      checkSafe(reportOne) == -1 ||
      checkSafe(reportTwo) == -1
    ) {
      safeCount = safeCount + 1
    } else {
      // only for log of not safe for debugging
      // console.log('not safe: ' + report)
    }
  }
})

// on end of input sort
reader.on('close', function () {
  console.log(safeCount) // 624 too low, 643 too low - result is 644 (why one more?)
})

// returns -1 if safe or index of first not safe element in array
function checkSafe(array) {
  let originalDirection = ''
  let safe = true

  for (let index = 0; index < array.length - 1; index++) {
    let currentLevel = Number(array[index])
    let nextLevel = Number(array[index + 1])

    if (index == 0) {
      if (currentLevel < nextLevel) originalDirection = 'increasing'
      if (currentLevel > nextLevel) originalDirection = 'decreasing'
    }

    let currentDirection =
      currentLevel < nextLevel ? 'increasing' : 'decreasing'
    let difference = Math.abs(currentLevel - nextLevel)
    if (difference == 0) safe = false
    if (difference < 1 || difference > 3) safe = false
    if (originalDirection != currentDirection) safe = false

    if (!safe) {
      return index // return index of where it is not safe start
    }
  }

  return -1
}
