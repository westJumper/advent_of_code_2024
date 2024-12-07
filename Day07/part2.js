const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

const operators = ['*', '+', '|']
var totalCalibrationResult = 0

// load lists
reader.on('line', function (line) {
  var expectedResult = Number(line.split(':')[0])
  var numbers = line.split(':')[1].trim().split(' ').map(Number)
  const numberOfPlaces = numbers.length - 1
  const operations = generateCombinationsOfOperations(operators, numberOfPlaces)
  var operationsWithNumbersInOneArray = combineOperationsWithNumbers(numbers, operations)

  // loop through all possible operation combinations and any of them equal to a result break a loop and add to a total calibration result
  for (let index = 0; index < operationsWithNumbersInOneArray.length; index++) {
    const onePossibleCombination = operationsWithNumbersInOneArray[index]
    var testAgainst = 0

    // loop through operators and calculate previous result/first number +/* next number
    if (onePossibleCombination.length == 1) {
      testAgainst = onePossibleCombination[0]
    } else {
      for (let index = 1; index < onePossibleCombination.length; index = index + 2) {
        if (testAgainst > expectedResult) break // optimization - break right at the beginning if I already know calculation is over a result and cannot be right

        var operator = onePossibleCombination[index]
        if (index == 1) {
          switch (operator) {
            case '+':
              testAgainst = onePossibleCombination[0] + onePossibleCombination[2]
              break
            case '*':
              testAgainst = onePossibleCombination[0] * onePossibleCombination[2]
              break
            case '|':
              testAgainst = Number(onePossibleCombination[0].toString() + onePossibleCombination[2].toString())
              break
            default:
              break
          }
        } else {
          switch (operator) {
            case '+':
              testAgainst = testAgainst + onePossibleCombination[index + 1]
              break
            case '*':
              testAgainst = testAgainst * onePossibleCombination[index + 1]
              break
            case '|':
              testAgainst = Number(testAgainst.toString() + onePossibleCombination[index + 1].toString())
              break
            default:
              break
          }
        }
      }
    }

    // after all operations are processed check if result equals to expected result, if it does add it to total calibration result continue with next line
    if (testAgainst == expectedResult) {
      totalCalibrationResult = totalCalibrationResult + expectedResult
      break
    }
  }
})

// on end of input sort
reader.on('close', function () {
  console.log('total calibration result: ' + totalCalibrationResult)
})

// recursive function helper inside, this accepts array of operators such as ['*', '+'] and what combination do I want
function generateCombinationsOfOperations(operators, numberOfPlaces) {
  var results = []

  recursivelyAddCombinations('', numberOfPlaces)

  // keeps operation in a simple string current and loops until reaches length
  function recursivelyAddCombinations(current, length) {
    // if we are at the end
    if (current.length === length) {
      results.push(current)
      return
    }

    operators.forEach(function (operator) {
      recursivelyAddCombinations(current + operator, length)
    })
  }

  return results
}

// this will create array of arrays where each array is combined numbers and operations in between them
function combineOperationsWithNumbers(numbers, operations) {
  const results = []

  operations.forEach(function (operation) {
    const chars = operation.split('') // Split operation into individual characters
    const combined = []

    for (let i = 0; i < numbers.length; i++) {
      combined.push(numbers[i]) // Add the number
      combined.push(chars[i]) // add the character
    }

    results.push(combined)
  })

  return results
}
