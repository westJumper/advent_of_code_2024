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
  listOne.sort()
  listTwo.sort()

  // list is already ordered
  var mapListTwo = new Map()
  for (let index = 0; index < listTwo.length; index++) {
    var currentValue = listTwo[index]
    if (mapListTwo.has(currentValue)) {
      mapListTwo.set(currentValue, Number(mapListTwo.get(currentValue)) + 1)
    } else {
      mapListTwo.set(currentValue, 1)
    }
  }

  for (let index = 0; index < listOne.length; index++) {
    const currentValue = listOne[index]
    distance += mapListTwo.has(currentValue)
      ? currentValue * mapListTwo.get(currentValue)
      : 0
  }

  console.log(distance)
})
