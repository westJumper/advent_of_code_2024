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
  // go from end of disc and move all same numbers next to each other (blocks) to free space always from start
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

    // check if we can place it from the left, if not continue with next place
    for (let index = 0; index < revIndex; index++) {
      var currentChar = disc[index]
      var countOfEmptySpaces = 0
      var placed = false // for breaking the cycle if we find place to move a block to
      if (currentChar != '.') continue // cannot place a block to not empty space
      if (currentChar == '.') {
        countOfEmptySpaces++ // found empty space

        var isSame = true
        if (!placed) {
          // for multiple places
          while (isSame) {
            // try to place it to a free space
            if (numberOfCharactersInFiles == countOfEmptySpaces) {
              //console.log('we can place ' + files + ' to position ' + (index + 1 - countOfEmptySpaces))
              // place and break
              for (let i = 0; i < numberOfCharactersInFiles; i++) {
                disc[index - i] = char
                disc[revIndex + i + 1] = '.'
              }
              placed = true
              break
            }

            // if not placed yet add more space and check if it is empty
            index++
            if (currentChar == disc[index]) {
              countOfEmptySpaces++ // add more space if the same
            } else {
              isSame = false // end loop if not the same
            }
          }
        }
      }
      //console.log(disc.join(''))
      if (placed) break // if we already placed break a cycle and go to another block, if not placed look for another place
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
}
