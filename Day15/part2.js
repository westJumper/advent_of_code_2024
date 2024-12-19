const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

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
  var linechars = []
  lineCharacters.forEach(function (character, index) {
    if (character == '@') cp = grid.length + '-' + index * 2
    if (character == '#') {
      linechars.push('#')
      linechars.push('#')
    }
    if (character == '@') {
      linechars.push('@')
      linechars.push('.')
    }
    if (character == '.') {
      linechars.push('.')
      linechars.push('.')
    }
    if (character == 'O') {
      linechars.push('[')
      linechars.push(']')
    }
  })
  grid.push(linechars)
})

// after file is read through
reader.on('close', function () {
  for (let index = 0; index < moves.length; index++) {
    const direction = moves[index]
    //console.log(calculate()) // to show each iteration visual in debug console
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
    if (grid[yp][xp - moveSteps] == ']') {
      moveSteps++
      moveSteps++
      continue
    }
    if (grid[yp][xp - moveSteps] == '.') {
      canMove = false
      // add from right @ then ]and[ until reached end
      for (let index = 0; index < moveSteps + 1; index++) {
        if (index == 0) {
          grid[yp][xp - index] = '.'
          continue
        }
        if (index == 1) {
          grid[yp][xp - index] = '@'
          continue
        }
        if (index % 2 == 0) {
          grid[yp][xp - index] = ']'
          continue
        } else {
          grid[yp][xp - index] = '['
          continue
        }
      }
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
    if (grid[yp][xp + moveSteps] == '[') {
      moveSteps++
      moveSteps++
      continue
    }
    if (grid[yp][xp + moveSteps] == '.') {
      canMove = false
      // add from right @ then ]and[ until reached end
      for (let index = 0; index < moveSteps + 1; index++) {
        if (index == 0) {
          grid[yp][xp + index] = '.'
          continue
        }
        if (index == 1) {
          grid[yp][xp + index] = '@'
          continue
        }
        if (index % 2 == 0) {
          grid[yp][xp + index] = '['
          continue
        } else {
          grid[yp][xp + index] = ']'
          continue
        }
      }
    }
    // move whole block
    // from current index until position set O and position - 1 set @
    return yp + '-' + (xp + 1)
  }
}

function moveUp(position) {
  var ypo = Number(position.split('-')[0]) // y position
  var xpo = Number(position.split('-')[1]) // x position

  // always add @ to queue and possible [ to the queue (never add ] as that will be counted with [)
  var toMoveQueue = [position]
  var queue = [position]
  if (grid[ypo - 1][xpo] == '[') {
    queue.push(ypo - 1 + '-' + xpo)
    toMoveQueue.push(ypo - 1 + '-' + xpo)
  } else if (grid[ypo - 1][xpo] == ']') {
    queue.push(ypo - 1 + '-' + (xpo - 1))
    toMoveQueue.push(ypo - 1 + '-' + (xpo - 1))
  }

  while (queue.length > 0) {
    var position = queue.shift()
    var yp = Number(position.split('-')[0]) // y position
    var xp = Number(position.split('-')[1]) // x position
    var currentChar = grid[yp][xp]

    switch (currentChar) {
      case '@':
        if (grid[yp - 1][xp] == '#') {
          return cp // cannot move
        }
        if (grid[yp - 1][xp] == '.') {
          grid[yp - 1][xp] = '@'
          grid[yp][xp] = '.'
          return yp - 1 + '-' + xp // move only @ right away
        }

        break
      case '[':
        var up = grid[yp - 1][xp]
        var upRight = grid[yp - 1][xp + 1]

        if (up == '#' || upRight == '#') {
          return cp // cannot move
        }

        // if end continue
        if (up == '.' && upRight == '.') {
          continue
        }

        // check for next [ and add it to queue for next checking
        if (up == '[' || upRight == ']') {
          queue.push(yp - 1 + '-' + xp)
          toMoveQueue.push(yp - 1 + '-' + xp)
        }
        if (upRight == '[') {
          queue.push(yp - 1 + '-' + (xp + 1))
          toMoveQueue.push(yp - 1 + '-' + (xp + 1))
        }
        if (up == ']') {
          queue.push(yp - 1 + '-' + (xp - 1))
          toMoveQueue.push(yp - 1 + '-' + (xp - 1))
        }
        break
      default:
        break
    }
  }

  toMoveQueue.reverse() // reverse to start from last and clean up simple
  toMoveQueue.forEach(function (position) {
    var yp = Number(position.split('-')[0]) // y position
    var xp = Number(position.split('-')[1]) // x position
    var char = grid[yp][xp]
    if (char == '@') {
      grid[yp][xp] = '.'
      grid[yp - 1][xp] = '@'
    } else {
      grid[yp][xp] = '.'
      grid[yp - 1][xp] = '['
      grid[yp][xp + 1] = '.'
      grid[yp - 1][xp + 1] = ']'
    }
  })

  return ypo - 1 + '-' + xpo
}

function moveDown(position) {
  var ypo = Number(position.split('-')[0]) // y position
  var xpo = Number(position.split('-')[1]) // x position

  // always add @ to queue and possible [ to the queue (never add ] as that will be counted with [)
  var toMoveQueue = [position]
  var queue = [position]
  if (grid[ypo + 1][xpo] == '[') {
    queue.push(ypo + 1 + '-' + xpo)
    toMoveQueue.push(ypo + 1 + '-' + xpo)
  } else if (grid[ypo + 1][xpo] == ']') {
    queue.push(ypo + 1 + '-' + (xpo - 1))
    toMoveQueue.push(ypo + 1 + '-' + (xpo - 1))
  }

  while (queue.length > 0) {
    var position = queue.shift()
    var yp = Number(position.split('-')[0]) // y position
    var xp = Number(position.split('-')[1]) // x position
    var currentChar = grid[yp][xp]

    switch (currentChar) {
      case '@':
        if (grid[yp + 1][xp] == '#') {
          return cp // cannot move
        }
        if (grid[yp + 1][xp] == '.') {
          grid[yp + 1][xp] = '@'
          grid[yp][xp] = '.'
          return yp + 1 + '-' + xp // move only @ right away
        }

        break
      case '[':
        var down = grid[yp + 1][xp]
        var downRight = grid[yp + 1][xp + 1]

        if (down == '#' || downRight == '#') {
          return cp // cannot move
        }

        // if end continue
        if (down == '.' && downRight == '.') {
          continue
        }

        // check for next [ and add it to queue for next checking
        if (down == '[' || downRight == ']') {
          queue.push(yp + 1 + '-' + xp)
          toMoveQueue.push(yp + 1 + '-' + xp)
        }
        if (downRight == '[') {
          queue.push(yp + 1 + '-' + (xp + 1))
          toMoveQueue.push(yp + 1 + '-' + (xp + 1))
        }
        if (down == ']') {
          queue.push(yp + 1 + '-' + (xp - 1))
          toMoveQueue.push(yp + 1 + '-' + (xp - 1))
        }
        break
      default:
        break
    }
  }

  toMoveQueue.reverse() // reverse to start from last and clean up simple
  toMoveQueue.forEach(function (position) {
    var yp = Number(position.split('-')[0]) // y position
    var xp = Number(position.split('-')[1]) // x position
    var char = grid[yp][xp]
    if (char == '@') {
      grid[yp][xp] = '.'
      grid[yp + 1][xp] = '@'
    } else {
      grid[yp][xp] = '.'
      grid[yp + 1][xp] = '['
      grid[yp][xp + 1] = '.'
      grid[yp + 1][xp + 1] = ']'
    }
  })

  return ypo + 1 + '-' + xpo
}

function calculate() {
  var result = 0
  for (let index = 0; index < grid.length; index++) {
    const yp = index
    var line = []
    for (let index = 0; index < grid[0].length; index++) {
      const xp = index
      line.push(grid[yp][xp])
      if (grid[yp][xp] == '[') {
        result = result + yp * 100 + xp
      }
    }
    //console.log(line.join()) // to show in debug console
  }
  return result
}
