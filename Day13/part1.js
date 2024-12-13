const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

// parse input
const ta = 3
const tb = 1
var tokens = 0

// create grid and set starting position
reader.on('line', function (line) {
  var lineType = getLineType(line)
  switch (lineType) {
    case 'a':
      ax = line.substring(line.indexOf('X+') + 2, line.indexOf(','))
      ay = line.substring(line.indexOf('Y+') + 2, line.length)
      break
    case 'b':
      bx = line.substring(line.indexOf('X+') + 2, line.indexOf(','))
      by = line.substring(line.indexOf('Y+') + 2, line.length)
      break
    case 'p':
      px = line.substring(line.indexOf('X=') + 2, line.indexOf(','))
      py = line.substring(line.indexOf('Y=') + 2, line.length)
      break
    case 'empty':
      // calculate line here before moving to next one
      // 1) divide price by button for each
      // 2) loop and start from number from 1 (floored to a whole number) and decrease one by one until modulo of button b is 0
      // 3) current number in loop 2 is presses of A and remainder divided by b is presses of B
      // 4) if sum of press a and press b multiplied by movement equals to price coordinations we have a winner

      // 1)
      sx = Math.floor(px / ax)
      sy = Math.floor(py / ay)

      for (let index = sx; index > 0; index--) {
        // if we press that many times as index for button a and remaining value modulo press b is 0 then we could have a match
        if ((px - index * ax) % bx == 0 && (py - index * ay) % by == 0) {
          pb = (px - index * ax) / bx // calculate press b
          // if sum of press a and press b multiplied by movement equals to price coordinations we have a winner
          if (ax * index + bx * pb == px && ay * index + by * pb == py) {
            tokens += index * ta + pb * tb
            break
          }
        }
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
