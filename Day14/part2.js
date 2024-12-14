const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var width = 101
var height = 103
var widthHalf = (width - 1) / 2
var heightHalf = (height - 1) / 2

var lines = []
// create grid and set starting position
reader.on('line', function (line) {
  var xi = Number(line.substring(line.indexOf('p=') + 2, line.indexOf(',')))
  var yi = Number(line.substring(line.indexOf(',') + 1, line.indexOf(' ')))
  var xv = Number(line.substring(line.indexOf('v=') + 2, line.lastIndexOf(',')))
  var yv = Number(line.substring(line.lastIndexOf(',') + 1, line.length))
  lines.push([xi, yi, xv, yv])
})

// after file is read through
reader.on('close', function () {
  // repeat maximum to 10000 (randomly selected)
  for (let index = 0; index < 10000; index++) {
    const elapsedTime = index
    var dots = []
    var q1 = 0
    var q2 = 0
    var q3 = 0
    var q4 = 0

    // calculate each point position after elapsed time
    for (let index = 0; index < lines.length; index++) {
      var xi = lines[index][0]
      var yi = lines[index][1]
      var xv = lines[index][2]
      var yv = lines[index][3]

      if (xv < 0) xv = xv + width
      if (yv < 0) yv = yv + height
      var xf = (xv * elapsedTime + xi) % width
      var yf = (yv * elapsedTime + yi) % height

      dots.push(yf + '-' + xf) // for visual confirmation

      if (xf < widthHalf && yf < heightHalf) q1++
      else if (xf > widthHalf && yf < heightHalf) q = q2++
      else if (xf < widthHalf && yf > heightHalf) q = q3++
      else if (xf > widthHalf && yf > heightHalf) q = q4++
    }

    // I assumed that if out of 500 dots there are "many" in one quadrant there can be a tree and it just works :)
    if (q1 > 200 || q2 > 200 || q3 > 200 || q4 > 200) {
      visual(dots)
      break
    }
  }
})

function visual(dots) {
  for (let index = 0; index < width; index++) {
    const yp = index
    var line = []
    for (let index = 0; index < height; index++) {
      const xp = index
      if (dots.includes(yp + '-' + xp)) {
        line.push('x')
      } else {
        line.push('.')
      }
    }
    console.log(line.join())
  }
}
