const f = require('fs')
const readline = require('readline')
var inputFile = 'test2.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var result = 0
var include = true

// load lists
reader.on('line', function (line) {
  const matches = [...line.matchAll(/mul\(\d*\,\d*\)|don\'t\(\)|do\(\)/g)]
  matches.forEach(function (match) {
    const type = match[0].substring(0, 3)

    switch (type) {
      case 'mul':
        if (include) {
          const first = Number(match[0].split(',')[0].split('(')[1])
          const second = Number(match[0].split(',')[1].split(')')[0])
          result = result + first * second
        }
        break
      case 'don':
        include = false
        break
      case 'do(':
        include = true
        break
      default:
        console.log('error')
        break
    }
  })
})

// on end of input sort
reader.on('close', function () {
  console.log(result)
})
