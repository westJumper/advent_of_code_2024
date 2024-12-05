const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var result = 0
var orderingRules = []
var updates = []

// load lists
var lineType = 'orderingRuleLine'
reader.on('line', function (line) {
  if (line == '') lineType = 'space'
  switch (lineType) {
    case 'orderingRuleLine':
      orderingRules.push(line)
      break
    case 'updateLine':
      updates.push(line)
      break
    case 'space':
      lineType = 'updateLine'
      break
    default:
      console.error('not recognized line type')
      break
  }
})

// on end of input sort
reader.on('close', function () {
  var incorrectUpdates = []

  updates.forEach(function (update) {
    var allNumbers = update.split(',')

    var possibleIncorrectCombinations = createPossibleIncorrectCombinations(allNumbers)
    // compare all incorrect variations with ordering rules, if match then update is incorrect
    var correct = false
    var takeIntoAccount = false

    while (!correct) {
      // loop through ordering rules to check if any matches possible incorrect combination
      for (let index = 0; index < orderingRules.length; index++) {
        // swap if we find something is wrong
        const orderingRule = orderingRules[index]
        possibleIncorrectCombinations.forEach(function (possibleIncorrectCombination) {
          if (possibleIncorrectCombination == orderingRule) {
            var swap = possibleIncorrectCombination.split('|')
            var swap1Index = allNumbers.indexOf(swap[0])
            var swap2Index = allNumbers.indexOf(swap[1])
            var temp = allNumbers[swap1Index]
            allNumbers[swap1Index] = allNumbers[swap2Index]
            allNumbers[swap2Index] = temp
            takeIntoAccount = true
            possibleIncorrectCombinations = createPossibleIncorrectCombinations(allNumbers)
          }
        })
      }

      // check if after swap it is better or loop again
      for (let index = 0; index < orderingRules.length; index++) {
        const orderingRule = orderingRules[index]
        if (
          possibleIncorrectCombinations.some(function (checkRule) {
            return checkRule == orderingRule
          })
        ) {
          correct = false
          break
        } else {
          correct = true
        }
      }
    }

    if (takeIntoAccount) {
      incorrectUpdates.push(allNumbers)
      result = result + Number(allNumbers[Math.round(allNumbers.length / 2) - 1])
    }
  })

  //console.log(JSON.stringify(incorrectUpdates))
  console.log(result)
})

function createPossibleIncorrectCombinations(allNumbers) {
  var checkRules = [] // hold all incorrect variations that can happen in update
  for (let index = 0; index < allNumbers.length - 1; index++) {
    const element = allNumbers[index]
    for (let innerIndex = index + 1; innerIndex < allNumbers.length; innerIndex++) {
      const innerElement = allNumbers[innerIndex]
      checkRules.push(innerElement + '|' + element)
    }
  }
  return checkRules
}
