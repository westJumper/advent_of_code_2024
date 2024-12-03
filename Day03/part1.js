const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var result = 0

// load lists
reader.on('line', function (line) {
  const matches = [...line.matchAll(/mul\(\d*\,\d*\)/g)]
  matches.forEach(function (match) {
    const first = Number(match[0].split(',')[0].split('(')[1])
    const second = Number(match[0].split(',')[1].split(')')[0])
    result = result + first * second
  })
})

// on end of input sort
reader.on('close', function () {
  console.log(result)
})
