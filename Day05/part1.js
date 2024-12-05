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
  //console.log(orderingRules)

  updates.forEach(function (update) {
    var incorrectVariations = [] // hold all incorrect variations that can happen in update
    let allNumbers = update.split(',')
    //console.log(allNumbers)
    for (let index = 0; index < allNumbers.length - 1; index++) {
      const element = allNumbers[index]
      for (let innerIndex = index + 1; innerIndex < allNumbers.length; innerIndex++) {
        const innerElement = allNumbers[innerIndex]
        incorrectVariations.push(innerElement + '|' + element)
      }
    }

    //console.log(incorrectVariations)

    // compare all incorrect variations with ordering rules, if match then update is incorrect
    var correct = true
    for (let index = 0; index < orderingRules.length; index++) {
      const orderingRule = orderingRules[index]
      if (
        incorrectVariations.some(function (incorrectVariation) {
          return incorrectVariation == orderingRule
        })
      ) {
        correct = false
        break
      }
    }
    if (correct) {
      //console.log('correct line')
      result = result + Number(allNumbers[Math.round(allNumbers.length / 2) - 1])
    } else {
      //console.log('incorrect line')
    }
    //console.log('--------')
  })

  console.log('result: ' + result)
})
