const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var safeCount = 0

// load lists
reader.on('line', function (line) {
  const report = line.split(' ')

  var originalDirection = ''
  var safe = true
  for (let index = 0; index < report.length - 1; index++) {
    const currentLevel = Number(report[index])
    const nextLevel = Number(report[index + 1])

    if (index == 0) {
      if (currentLevel < nextLevel) originalDirection = 'increasing'
      if (currentLevel > nextLevel) originalDirection = 'decreasing'
    }

    const currentDirection =
      currentLevel < nextLevel ? 'increasing' : 'decreasing'
    const difference = Math.abs(currentLevel - nextLevel)
    if (difference > 3 || difference < 1) safe = false
    if (originalDirection != currentDirection) safe = false

    if (!safe) break // jump out of for loop if not safe already
  }

  if (safe) safeCount = safeCount + 1
})

// on end of input sort
reader.on('close', function () {
  console.log(safeCount)
})
