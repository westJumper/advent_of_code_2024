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
  //console.log(updates)

  updates.forEach(function (update) {
    var checkRules = [] // hold all incorrect variations that can happen in update
    let allNumbers = update.split(',')
    for (let index = 0; index < allNumbers.length - 1; index++) {
      const element = allNumbers[index]
      for (let innerIndex = index + 1; innerIndex < allNumbers.length; innerIndex++) {
        const innerElement = allNumbers[innerIndex]
        checkRules.push(innerElement + '|' + element)
      }
    }

    // compare all incorrect variations with ordering rules, if match then update is incorrect
    var correct = true
    for (let index = 0; index < orderingRules.length; index++) {
      const orderingRule = orderingRules[index]
      if (
        checkRules.some(function (checkRule) {
          return checkRule == orderingRule
        })
      ) {
        correct = false
        break
      }
    }
    if (correct) {
      result = result + Number(allNumbers[Math.round(allNumbers.length / 2) - 1])
    }
  })

  console.log('result: ' + result)
})
