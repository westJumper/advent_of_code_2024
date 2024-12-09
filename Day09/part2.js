const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var disc = [] // global variable reused through the whole process even in functions

// load lists
reader.on('line', function (line) {
  createFilesAndFreespacesFromInput(line)
  console.log(disc.join(''))
})

// on end of input sort
reader.on('close', function () {
  compactSpace()
  console.log(disc.join(''))
  console.log(calculateChecksum())
})

// FUNCTIONS

function createFilesAndFreespacesFromInput(line) {
  // create line of file (number) and free space (.) based on input, for example 00...111...2...333.44.5555.6666.777.888899
  line.split('').forEach(function (character, i) {
    if (i % 2) {
      for (let index = 0; index < Number(character); index++) {
        disc.push('.')
      }
    } else {
      for (let index = 0; index < Number(character); index++) {
        disc.push(i / 2)
      }
    }
  })
}

function compactSpace() {
  for (let revIndex = disc.length - 1; revIndex > 0; null) {
    const char = disc[revIndex]
    var numberOfCharactersInFiles = 1
    if (char == '.') {
      revIndex--
      continue // cannot compact empty space
    }

    // calculate number of same numbers
    var isSame = true
    while (isSame) {
      revIndex--
      if (disc[revIndex] == char) {
        numberOfCharactersInFiles++
      } else {
        isSame = false
      }
    }

    // check if we can place it from the left, if not continue
    for (let index = 0; index < revIndex; index++) {
      var currentChar = disc[index]
      var countOfEmptySpaces = 0
      var placed = false
      if (currentChar != '.') continue
      if (currentChar == '.') {
        countOfEmptySpaces++

        // for one place file only
        if (numberOfCharactersInFiles == countOfEmptySpaces) {
          //console.log('we can place ' + files + ' to position ' + (index + 1 - countOfEmptySpaces))
          // place and break
          for (let i = 0; i < numberOfCharactersInFiles; i++) {
            var test = index - i
            var test2 = revIndex + i + 1
            disc[test] = char
            disc[test2] = '.'
          }
          placed = true
        }

        var isSame = true
        if (!placed) {
          // for multiple places
          while (isSame) {
            index++
            if (currentChar == disc[index]) {
              countOfEmptySpaces++
              if (numberOfCharactersInFiles == countOfEmptySpaces) {
                //console.log('we can place ' + files + ' to position ' + (index + 1 - countOfEmptySpaces))
                // place and break
                for (let i = 0; i < numberOfCharactersInFiles; i++) {
                  var test = index - i
                  var test2 = revIndex + i + 1
                  disc[test] = char
                  disc[test2] = '.'
                }
                placed = true
                break
              }
            } else {
              isSame = false
            }
          }
        }
      }
      //console.log(disc.join(''))
      if (placed) break
    }
  }
  return disc
}

function calculateChecksum() {
  var checksum = 0
  for (let index = 0; index < disc.length; index++) {
    if (disc[index] == '.') {
      continue
    }
    checksum = checksum + index * disc[index]
  }

  return checksum
  //6321896265143
}
