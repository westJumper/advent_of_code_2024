const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var disc = [] // global variable reused through the whole process even in functions

// load lists
reader.on('line', function (line) {
  createFilesAndFreespacesFromInput(line)
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
  // compact = loop from left and if empty space switch the very first file from the end to that free position
  for (let index = 0; index < disc.length; index++) {
    var character = disc[index]
    if (character == '.') {
      for (let revIndex = disc.length - 1; revIndex > index; revIndex--) {
        const char = disc[revIndex]
        if (char == '.') continue
        disc[index] = disc[revIndex]
        disc[revIndex] = '.'
        break
      }
    }
  }
  return disc
}

function calculateChecksum() {
  var checksum = 0
  for (let index = 0; index < disc.length; index++) {
    if (disc[index] == '.') break
    checksum = checksum + index * disc[index]
  }
  return checksum
}
