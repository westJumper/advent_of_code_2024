const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

// parse input
var grid = []
var moves = []
var cp
// create grid and moves
reader.on('line', function (line) {
  var lineCharacters = line.split('')
  if (lineCharacters.length == 0) return
  if (lineCharacters[0] != '#') {
    moves.push(...lineCharacters)
    return
  }
  var lineCharactersNumbers = lineCharacters.map(function (character, index) {
    if (character == '@') cp = grid.length + '-' + index
    return character
  })
  grid.push(lineCharactersNumbers)
})

// after file is read through
reader.on('close', function () {
  for (let index = 0; index < moves.length; index++) {
    const direction = moves[index]

    switch (direction) {
      case '<':
        cp = moveLeft(cp)
        break
      case '^':
        cp = moveUp(cp)
        break
      case '>':
        cp = moveRight(cp)
        break
      case 'v':
        cp = moveDown(cp)
        break
      default:
        break
    }
  }

  console.log(calculate())
})

function moveLeft(position) {
  var yp = Number(position.split('-')[0]) // y position
  var xp = Number(position.split('-')[1]) // x position

  // move left with O as well
  var moveSteps = 1
  var canMove = true
  while (canMove) {
    if (grid[yp][xp - moveSteps] == '#') {
      return cp // cannot move
    }
    if (grid[yp][xp - moveSteps] == 'O') {
      moveSteps++
      continue
    }
    if (grid[yp][xp - moveSteps] == '.') {
      canMove = false
      grid[yp][xp - moveSteps] = 'O'
      grid[yp][xp - 1] = '@'
      grid[yp][xp] = '.'
    }
    // move whole block
    // from current index until position set O and position - 1 set @
    return yp + '-' + (xp - 1)
  }
}

function moveRight(position) {
  var yp = Number(position.split('-')[0]) // y position
  var xp = Number(position.split('-')[1]) // x position

  // move left with O as well
  var moveSteps = 1
  var canMove = true
  while (canMove) {
    if (grid[yp][xp + moveSteps] == '#') {
      return cp // cannot move
    }
    if (grid[yp][xp + moveSteps] == 'O') {
      moveSteps++
      continue
    }
    if (grid[yp][xp + moveSteps] == '.') {
      canMove = false
      grid[yp][xp + moveSteps] = 'O'
      grid[yp][xp + 1] = '@'
      grid[yp][xp] = '.'
    }
    // move whole block
    // from current index until position set O and position - 1 set @
    return yp + '-' + (xp + 1)
  }
}

function moveUp(position) {
  var yp = Number(position.split('-')[0]) // y position
  var xp = Number(position.split('-')[1]) // x position
  // move left with O as well
  var moveSteps = 1
  var canMove = true
  while (canMove) {
    if (grid[yp - moveSteps][xp] == '#') {
      return cp // cannot move
    }
    if (grid[yp - moveSteps][xp] == 'O') {
      moveSteps++
      continue
    }
    if (grid[yp - moveSteps][xp] == '.') {
      canMove = false
      grid[yp - moveSteps][xp] = 'O'
      grid[yp - 1][xp] = '@'
      grid[yp][xp] = '.'
    }
    // move whole block
    // from current index until position set O and position - 1 set @
    return yp - 1 + '-' + xp
  }
}

function moveDown(position) {
  var yp = Number(position.split('-')[0]) // y position
  var xp = Number(position.split('-')[1]) // x position

  // move left with O as well
  var moveSteps = 1
  var canMove = true
  while (canMove) {
    if (grid[yp + moveSteps][xp] == '#') {
      return cp // cannot move
    }
    if (grid[yp + moveSteps][xp] == 'O') {
      moveSteps++
      continue
    }
    if (grid[yp + moveSteps][xp] == '.') {
      canMove = false
      grid[yp + moveSteps][xp] = 'O'
      grid[yp + 1][xp] = '@'
      grid[yp][xp] = '.'
    }
    // move whole block
    // from current index until position set O and position - 1 set @
    return yp + 1 + '-' + xp
  }
}

function calculate() {
  var result = 0
  for (let index = 0; index < grid.length; index++) {
    const yp = index
    var line = []
    for (let index = 0; index < grid[0].length; index++) {
      const xp = index
      if (grid[yp][xp] == 'O') {
        result = result + yp * 100 + xp
      }
    }
  }
  return result
}
