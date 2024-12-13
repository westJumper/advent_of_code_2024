const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

// parse input
const ta = 3
const tb = 1
const adjustPosition = 10000000000000
var tokens = 0

// create grid and set starting position
reader.on('line', function (line) {
  var lineType = getLineType(line)
  switch (lineType) {
    case 'a':
      ax = Number(line.substring(line.indexOf('X+') + 2, line.indexOf(',')))
      ay = Number(line.substring(line.indexOf('Y+') + 2, line.length))
      break
    case 'b':
      bx = Number(line.substring(line.indexOf('X+') + 2, line.indexOf(',')))
      by = Number(line.substring(line.indexOf('Y+') + 2, line.length))
      break
    case 'p':
      px = Number(line.substring(line.indexOf('X=') + 2, line.indexOf(','))) + adjustPosition
      py = Number(line.substring(line.indexOf('Y=') + 2, line.length)) + adjustPosition
      break
    case 'empty':
      // part 2 is done through linear algebra and intersections
      const pa = (px * by - bx * py) / (by * ax - bx * ay)
      const pb = (py * ax - ay * px) / (by * ax - bx * ay)

      // check if a result of presses is a positive number due to linear algebra and is a whole number (integer)
      if (pa >= 0 && pb >= 0 && Number.isInteger(pa) && Number.isInteger(pb)) {
        tokens = tokens + (pa * ta + pb * tb)
      }

      break
    default:
      break
  }
})

// after file is read through
reader.on('close', function () {
  console.log('fewest tokens: ' + tokens)
})

function getLineType(line) {
  if (line == '') return 'empty'
  if (line.startsWith('Button A:')) return 'a'
  if (line.startsWith('Button B:')) return 'b'
  if (line.startsWith('Prize:')) return 'p'
}
