const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var stones = []
var blinksPart1 = 25
var blinksPart2 = 75
var stonesCount = 0
var resultCache = new Map()

// create grid and set starting position
reader.on('line', function (line) {
  stones = line.split(' ').map(Number)
})

// after file is read through
reader.on('close', function () {
  // calculate each stone separately how many stones it will create after all blinks and sum all those counts for all stones
  for (let index = 0; index < stones.length; index++) {
    const stone = stones[index]
    stonesCount = stonesCount + countOfStones(stone, blinksPart1)
  }

  console.log('stones part one: ' + stonesCount)

  stonesCount = 0
  for (let index = 0; index < stones.length; index++) {
    const stone = stones[index]
    stonesCount = stonesCount + countOfStones(stone, blinksPart2)
  }
  console.log('stones part two: ' + stonesCount)
})

// recursive function with cache
// before we return a result we add it to cache
// first thing in a function we check if we already know a result for a combination of stone and blinks and return it from cache without counting again
function countOfStones(stone, blinks) {
  const cacheKey = stone + '-' + blinks
  if (resultCache.get(cacheKey)) return resultCache.get(cacheKey)
  if (blinks == 0) return 1
  if (stone == 0) {
    var result = countOfStones(1, blinks - 1)
    resultCache.set(cacheKey, result)
    return result
  }
  var result
  if (stone.toString().length % 2 == 0) {
    var leftStone = stone.toString().slice(0, stone.toString().length / 2)
    var rightStone = stone.toString().slice(stone.toString().length / 2, stone.toString().length)
    result = countOfStones(Number(leftStone), blinks - 1) + countOfStones(Number(rightStone), blinks - 1)
  } else {
    result = countOfStones(stone * 2024, blinks - 1)
  }
  resultCache.set(cacheKey, result)
  return result
}
