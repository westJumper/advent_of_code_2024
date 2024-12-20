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
  var seen = new Set()

  // y-x, direction, count
  var queue = [[start, 'right', 0]]

  while (queue.length != 0) {
    // sort queue to take the lowest steps
    queue.sort((a, b) => {
      return a[2] - b[2] // second is count
    })

    // load values of the chosen lowest heap loss
    var currentqueue = queue.shift()
    var [position, direction, count] = currentqueue
    var y = Number(position.split('-')[0])
    var x = Number(position.split('-')[1])

    // we have seen this already, skip processing
    if (seen.has(position + '-' + direction)) continue

    // add to seen
    seen.add(position + '-' + direction)

    switch (direction) {
      case 'left':
        if (grid[y][x - 1] == pathCharacter || grid[y][x - 1] == endCharacter) queue.push([y + '-' + (x - 1), 'left', count + 1])
        if (grid[y - 1][x] == pathCharacter || grid[y - 1][x] == endCharacter) queue.push([position, 'top', count + 1000])
        if (grid[y + 1][x] == pathCharacter || grid[y + 1][x] == endCharacter) queue.push([position, 'bottom', count + 1000])
        break
      case 'right':
        if (grid[y][x + 1] == pathCharacter || grid[y][x + 1] == endCharacter) queue.push([y + '-' + (x + 1), 'right', count + 1])
        if (grid[y - 1][x] == pathCharacter || grid[y - 1][x] == endCharacter) queue.push([position, 'top', count + 1000])
        if (grid[y + 1][x] == pathCharacter || grid[y + 1][x] == endCharacter) queue.push([position, 'bottom', count + 1000])
        break
      case 'top':
        if (grid[y - 1][x] == pathCharacter || grid[y - 1][x] == endCharacter) queue.push([y - 1 + '-' + x, 'top', count + 1])
        if (grid[y][x + 1] == pathCharacter || grid[y][x + 1] == endCharacter) queue.push([position, 'right', count + 1000])
        if (grid[y][x - 1] == pathCharacter || grid[y][x - 1] == endCharacter) queue.push([position, 'left', count + 1000])
        break
      case 'bottom':
        if (grid[y + 1][x] == pathCharacter || grid[y + 1][x] == endCharacter) queue.push([y + 1 + '-' + x, 'bottom', count + 1])
        if (grid[y][x + 1] == pathCharacter || grid[y][x + 1] == endCharacter) queue.push([position, 'right', count + 1000])
        if (grid[y][x - 1] == pathCharacter || grid[y][x - 1] == endCharacter) queue.push([position, 'left', count + 1000])
        break

      default:
        break
    }

    // if we reached the end position we found a winner - break a loop
    if (position == end) {
      console.log('final count: ' + count)
      break
    }
  }
})
