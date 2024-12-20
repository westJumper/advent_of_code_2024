const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var start
var end
const pathCharacter = '.'
const endCharacter = 'E'
var bestPathCount = 0

// parse input
var grid = []
// create grid and moves
reader.on('line', function (line) {
  var lineCharacters = line.split('')
  var lineCharactersNumbers = lineCharacters.map(function (character, index) {
    if (character == 'S') start = grid.length + '-' + index
    if (character == 'E') end = grid.length + '-' + index
    return character
  })
  grid.push(lineCharactersNumbers)
})

reader.on('close', function () {
  // indexes of those positions
  var pointsToFinish = new Set()
  pointsToFinish.add(end) // add end as well

  var alreadyFound = false
  var wasHere = new Map()
  // y-x, direction, count
  var queue = [[start, 'right', 0, [start, end]]]

  while (queue.length != 0) {
    // sort queue to take the lowest steps
    queue.sort((a, b) => {
      return a[2] - b[2] // second is count
    })

    // load values of the chosen lowest heap loss
    var currentqueue = queue.shift()
    var [position, direction, count, visited] = currentqueue
    var y = Number(position.split('-')[0])
    var x = Number(position.split('-')[1])

    if (alreadyFound && count > bestPathCount) continue
    if (wasHere.has(position + '-' + direction) && wasHere.get(position + '-' + direction) < count) continue
    wasHere.set(position + '-' + direction, count)

    // if we reached the end position we found a winner, add visited points from current path to all
    if (position == end) {
      if (alreadyFound == false) {
        alreadyFound = true
        if (bestPathCount <= count) {
          bestPathCount = count
          visited.forEach(function (point) {
            pointsToFinish.add(point)
          })
        }
      } else {
        if (bestPathCount <= count) {
          bestPathCount = count
          visited.forEach(function (point) {
            pointsToFinish.add(point)
          })
        }
      }
    }

    switch (direction) {
      case 'left':
        if (grid[y][x - 1] == pathCharacter || grid[y][x - 1] == endCharacter) queue.push([y + '-' + (x - 1), 'left', count + 1, [...visited, position]])
        if (grid[y - 1][x] == pathCharacter || grid[y - 1][x] == endCharacter) queue.push([position, 'top', count + 1000, [...visited]])
        if (grid[y + 1][x] == pathCharacter || grid[y + 1][x] == endCharacter) queue.push([position, 'bottom', count + 1000, [...visited]])
        //seen.add(position + '-right')
        break
      case 'right':
        if (grid[y][x + 1] == pathCharacter || grid[y][x + 1] == endCharacter) queue.push([y + '-' + (x + 1), 'right', count + 1, [...visited, position]])
        if (grid[y - 1][x] == pathCharacter || grid[y - 1][x] == endCharacter) queue.push([position, 'top', count + 1000, [...visited]])
        if (grid[y + 1][x] == pathCharacter || grid[y + 1][x] == endCharacter) queue.push([position, 'bottom', count + 1000, [...visited]])
        //seen.add(position + '-left')
        break
      case 'top':
        if (grid[y - 1][x] == pathCharacter || grid[y - 1][x] == endCharacter) queue.push([y - 1 + '-' + x, 'top', count + 1, [...visited, position]])
        if (grid[y][x + 1] == pathCharacter || grid[y][x + 1] == endCharacter) queue.push([position, 'right', count + 1000, [...visited]])
        if (grid[y][x - 1] == pathCharacter || grid[y][x - 1] == endCharacter) queue.push([position, 'left', count + 1000, [...visited]])
        //seen.add(position + '-bottom')
        break
      case 'bottom':
        if (grid[y + 1][x] == pathCharacter || grid[y + 1][x] == endCharacter) queue.push([y + 1 + '-' + x, 'bottom', count + 1, [...visited, position]])
        if (grid[y][x + 1] == pathCharacter || grid[y][x + 1] == endCharacter) queue.push([position, 'right', count + 1000, [...visited]])
        if (grid[y][x - 1] == pathCharacter || grid[y][x - 1] == endCharacter) queue.push([position, 'left', count + 1000, [...visited]])
        //seen.add(position + '-top')
        break

      default:
        break
    }
  }
  showGrid(pointsToFinish)
  console.log('best path count: ' + bestPathCount)
  console.log('final count of visited points to finish: ' + pointsToFinish.size)
})

function showGrid(visited) {
  var result = 0
  for (let index = 0; index < grid.length; index++) {
    const yp = index
    var line = []
    for (let index = 0; index < grid[0].length; index++) {
      const xp = index
      var char = grid[yp][xp]
      if (visited.has(yp + '-' + xp)) {
        char = 'O'
      }
      line.push(char)
    }
    console.log(line.join(''))
  }
  return result
}
