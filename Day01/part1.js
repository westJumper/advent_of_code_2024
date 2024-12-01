const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var listOne = []
var listTwo = []
var distance = 0

// load lists
reader.on('line', function (line) {
  listOne.push(Number(line.split('   ')[0]))
  listTwo.push(Number(line.split('   ')[1]))
})

// on end of input sort
reader.on('close', function () {
  // sort from lowest
  listOne.sort()
  listTwo.sort()

  for (let index = 0; index < listOne.length; index++) {
    const first = listOne[index]
    const second = listTwo[index]

    distance += Math.max(first, second) - Math.min(first, second)
  }

  console.log(distance)
})
