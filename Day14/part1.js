const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

const elapsedTime = 100

var width = 101
var height = 103
if (inputFile != 'input.txt') {
  width = 11
  height = 7
}
var widthHalf = (width - 1) / 2
var heightHalf = (height - 1) / 2
var q1 = 0
var q2 = 0
var q3 = 0
var q4 = 0

// create grid and set starting position
reader.on('line', function (line) {
  var xi = Number(line.substring(line.indexOf('p=') + 2, line.indexOf(',')))
  var yi = Number(line.substring(line.indexOf(',') + 1, line.indexOf(' ')))
  var xv = Number(line.substring(line.indexOf('v=') + 2, line.lastIndexOf(',')))
  var yv = Number(line.substring(line.lastIndexOf(',') + 1, line.length))

  if (xv < 0) xv = xv + width
  if (yv < 0) yv = yv + height
  var xf = (xv * elapsedTime + xi) % width
  var yf = (yv * elapsedTime + yi) % height

  if (xf < widthHalf && yf < heightHalf) q1++
  else if (xf > widthHalf && yf < heightHalf) q = q2++
  else if (xf < widthHalf && yf > heightHalf) q = q3++
  else if (xf > widthHalf && yf > heightHalf) q = q4++
})

// after file is read through
reader.on('close', function () {
  console.log('result: ' + q1 * q2 * q3 * q4)
})
