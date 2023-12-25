const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(`\n`);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractLinesFromInputFile()));
    const end = Date.now();
    console.log(`start: ${start}\nend: ${end}`);
}

function solvePuzzle(lines) {
    let conditionRecords = getConditionRecords(lines);
    let result = 0;
    for(const conditionRecord of conditionRecords) {
        result += conditionRecord.possibleVariations.length;
    } 
    printResult(conditionRecords);
    return result;
}

function printResult(conditionRecords) {
    let result = [];
    for(const conditionRecord of conditionRecords) {
        for(const variation of conditionRecord.possibleVariations) {
            result.push(variation.replaceAll('$', '#'));
        }
    }
    fs.writeFileSync(__dirname + '/testNew.txt', result.join(`\n`));
}

function getConditionRecords(lines) {
    let conditionRecords = [];
    for(const line of lines) {
        let splitLine = line.split(' ');
        conditionRecords.push(new ConditionRecord(splitLine[0], splitLine[1]));
    }
    return conditionRecords;
}

// function getConditionRecords(lines) {
//     let conditionRecords = [];
//     for(const line of lines) {
//         let splitLine = line.split(' ');
//         conditionRecords.push(new ConditionRecord(getCopiesWithSeperator(splitLine[0], '?', 4), getCopiesWithSeperator(splitLine[1], ',', 4)));
//     }
//     return conditionRecords;
// }

// function getCopiesWithSeperator(stringToCopy, seperator, numberOfCopies) {
//     let result = stringToCopy;
//     for(let i = 0; i < numberOfCopies; i++) {
//         result = result.concat(seperator, stringToCopy);
//     }
//     return result;
// }

class ConditionRecord {
    constructor(symbolFormat, numberFormat) {
        this.symbolFormat = symbolFormat;
        this.numberFormat = numberFormat;
        this.numbers = this.getNumbers();
        this.possibleVariations = this.getPossibleVariations();
    }

    getNumbers() {
        let result = [];
        let numbers = [];
        numbers = this.numberFormat.split(',');
        for(let i = 0; i < numbers.length; i++) {
            result.push(new Number(parseInt(numbers[i]), numbers.slice(0, i).map(element => parseInt(element)), numbers.slice(i + 1, numbers.length).map(element => parseInt(element)), this.symbolFormat));
        }
        return result;
    }

    getPossibleVariations() {
        let variations = [];
        let currentNumberIndex = 0;

        this.numbers.sort(bubbleSortByNumberOfCoordinateSets);
        this.numbers.forEach(value => value.currentCoordinateSetIndex = -1);
        
        let baseSymbolRow = this.symbolFormat.split('');
        let checkpointSymbolRow = baseSymbolRow.map(value => value);
        

        while(currentNumberIndex !== -1) {
            let currentNumber = this.numbers[currentNumberIndex];
            
            if (this.numbers[this.numbers.indexOf(currentNumber) + 1]) {
                if (currentNumber.coordinateSets[currentNumber.currentCoordinateSetIndex + 1]) {
                    if (currentNumber.currentCoordinateSetIndex !== -1) {
                        reverseChangesAtCoordinates(checkpointSymbolRow, currentNumber.coordinateSets[currentNumber.currentCoordinateSetIndex]);
                    }
                    currentNumber.currentCoordinateSetIndex++;

                    let newlyUpdatedSymbolRow = tryHashtagingAtCoordinates(checkpointSymbolRow, currentNumber.coordinateSets[currentNumber.currentCoordinateSetIndex]);
                    if (newlyUpdatedSymbolRow) {
                        checkpointSymbolRow = newlyUpdatedSymbolRow.map(value => value);
                        currentNumberIndex++;
                    }
                }
                else {
                    currentNumberIndex--;
                    currentNumber.currentCoordinateSetIndex = -1;
                }
            }
            else {
                for(const coordinateSet of currentNumber.coordinateSets) {
                    let completedSymbolRow = tryHashtagingAtCoordinates(checkpointSymbolRow, coordinateSet);
                    if (completedSymbolRow) {
                        completedSymbolRow = completedSymbolRow.join('');
                        if (!variations.find(value => value === completedSymbolRow)) {
                            if (symbolRowVariationIsValid(completedSymbolRow, this.numberFormat)) {
                                variations.push(completedSymbolRow);
                            }
                        }
                    }
                }
                currentNumberIndex--;
            }
        }
        return variations;
    }
}

function symbolRowVariationIsValid(symbolRowToValidate, numbersToValidateAgainst) {
    return (numbersToValidateAgainst === getNumbersFormat(symbolRowToValidate));
}

function getNumbersFormat(string) {
    let numbers = [];
    for(let position = 0; position < string.length; position++) {
        if (isHashtag(string[position])) {
            let number = getNumber(string, position);
            numbers.push(number);
            position += number;
        }
    }
    return numbers.join(',');
}

function getNumber(str, position) {
    let result = 0;
    for(let i = position; isHashtag(str[i]); i++) {
        result ++;
    }
    return result;
}

function isHashtag(char) {
    return (char === '$');  //TODO
}

function tryHashtagingAtCoordinates(symbolRow, coordinateSet) {
    let localSymbolRow = symbolRow.map(value => value);
    if ((localSymbolRow[coordinateSet.startIndex - 1] !== '#') && (localSymbolRow[coordinateSet.endIndex + 1] !== '#') && (localSymbolRow[coordinateSet.startIndex - 1] !== '$') && (localSymbolRow[coordinateSet.endIndex + 1] !== '$')) {
        for(let i = coordinateSet.startIndex; i <= coordinateSet.endIndex; i++) {
            if (localSymbolRow[i] !== '$') {
                localSymbolRow.splice(i, 1, '$');
            } else {
                return undefined;
            }
        }
        return localSymbolRow;
    }
    return undefined;
}

function reverseChangesAtCoordinates(symbolRow, coordinateSet) {
    for(let i = coordinateSet.startIndex; i <= coordinateSet.endIndex; i++) {
        let originalSymbolIndex = 0;
        let originalSymbol = coordinateSet.originalSymbols[originalSymbolIndex]
        symbolRow.splice(i, 1, originalSymbol);
        originalSymbolIndex++;
    }
}

class Number {
    constructor(value, precedingNumbers, succeedingNumbers, symbolRow) {
        this.value = value;
        this.precedingNumbers = [...precedingNumbers];
        this.succeedingNumbers = [...succeedingNumbers];
        this.symbolRow = symbolRow;
        this.zone = this.getZone();
        this.coordinateSets = this.getCoordinateSets();
    }
    getZone() {
        //up my reduce-game? i could define a function that i would pass in as a callback (reduce redunduncy - haha reduce; i know.)
        let zoneStart = (this.precedingNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + this.precedingNumbers.length);
        let zoneEnd = this.symbolRow.length - (this.succeedingNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + this.succeedingNumbers.length);
        return {
            startIndex: zoneStart,
            endIndex: zoneEnd - 1,
            numberOfCoordinateSets: (zoneEnd - zoneStart) - this.value + 1
            //wiggleSpace: (zoneEnd - zoneStart) - this.value,
            // numberOfCoordinateSets: wiggleSpace + 1
        };
    }
    getCoordinateSets() {
        let result = [];
        for(let i = 0; i < this.zone.numberOfCoordinateSets; i++) {
            let symbolRowVariation = [...this.symbolRow];
            let sequenceStartIndex = this.zone.startIndex + i;
            let sequenceEndIndex = sequenceStartIndex + this.value - 1;
            const removedSymbols = symbolRowVariation.splice(sequenceStartIndex, this.value, getHashtagString(this.value));
            if (removedSymbols.indexOf('.') !== -1) {
                continue;
            }
            symbolRowVariation = symbolRowVariation.join('');
           if (coordinateSetIsValid(symbolRowVariation, sequenceStartIndex, sequenceEndIndex)) {
                let coordinateSet = {
                    startIndex: sequenceStartIndex,
                    endIndex: sequenceEndIndex,
                    originalSymbols: removedSymbols.join('')
                } 
               result.push(coordinateSet);
           }
        }
        return result;
    }
}

function coordinateSetIsValid(symbolRowVariation, sequenceStartIndex, sequenceEndIndex) {
    return (symbolRowVariation[sequenceStartIndex - 1] !== '#') && (symbolRowVariation[sequenceEndIndex + 1] !== '#');
}

function bubbleSortByNumberOfCoordinateSets(a, b) {
    if (a.coordinateSets.length > b.coordinateSets.length) {
        return 1;
    } else if (a.coordinateSets.length < b.coordinateSets.length) {
        return -1;
    } else {
        return 0;
    }
}

function getHashtagString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += '#';
    }
    return result;
}

main();

module.exports.main = main;