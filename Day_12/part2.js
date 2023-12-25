const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/testInput.txt', 'utf8');
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
        result += conditionRecord.compatibleVariations.length;
    } 
    
    return result;
}

function getConditionRecords(lines) {
    let conditionRecords = [];
    for(const line of lines) {
        let splitLine = line.split(' ');
        conditionRecords.push(new ConditionRecord(getCopiesWithSeperator(splitLine[0], '?', 4), getCopiesWithSeperator(splitLine[1], ',', 4)));
    }
    return conditionRecords;
}

function getCopiesWithSeperator(stringToCopy, seperator, numberOfCopies) {
    let result = stringToCopy;
    for(let i = 0; i < numberOfCopies; i++) {
        result = result.concat(seperator, stringToCopy);
    }
    return result;
}

class ConditionRecord {
    constructor(symbolFormat, numberFormat) {
         this.symbolFormat = symbolFormat;
        this.numberFormat = numberFormat;
        this.numbers = this.getNumbers();
        this.compatibleVariations = this.getCompatibleVariations();
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
    getCompatibleVariations() {
        const allVariationsSets = this.getAllVariationSets();
        let compatibleVariations = [];

        for(const variationSet of allVariationsSets) {
            const symbolRowToValidate = this.getSymbolRowVariation(variationSet);
            if(this.symbolRowVariationIsValid(symbolRowToValidate)) {
                if (!compatibleVariations.find(value => value === symbolRowToValidate))  {
                    compatibleVariations.push(symbolRowToValidate);
            
                }
            }
        }
        return compatibleVariations;
    }

    symbolRowVariationIsValid(symbolRowToValidate) {
        return (this.numberFormat === getNumbersFormat(symbolRowToValidate));
    }
    
    getSymbolRowVariation(variationSet) {
        let symbolRowVariation = this.symbolFormat.split('');

        for(let i = 0; i < this.symbolFormat.length; i++) {
            for(const variation of variationSet) {
                if(variation[i] === '#') {
                    symbolRowVariation.splice(i, 1,'#');
                }
            }
        }
        return symbolRowVariation.join('');
    }
    getAllVariationSets() {
        let combinationSets = [];
        let currentNumberIndex = 0;
        let combinationSet = initArray(this.numbers.length);
        this.numbers.sort(bubbleSortByNumberOfCombinations);

        //[EXPLENATION] set the initial to -1, so the first value isnt skipped
        //[SYNTAX] also, let and const are influencing wheter the "reassignment" occurs, not the "change of properties" of number, so that's why const is used here
        this.numbers.forEach(value => value.currentCombinationIndex = -1);

        //TODO replace with an eliminating version
        //> after each added version to the final combination, check if it is still valid
        //>> if not, skip the whole sequence and move to the next one
        //>>> for example: if the 1st and 2nd number do not have a compatible 1st generation combination [1.1 <=> 2.1], move on to the [1.1 <=> 2.1] and skip adding the rest [1.1 <=> 2.1 <=> 3.1]
        //>>>> simply using  Number.prototype.combinationIsValid() won't work
        //>>>>> gotta check only the 1st X numbers
        //>>>>>> scenario: I'm checking 3rd number's 1st generation against the so far made version of the variation [1.1 <=> 2.1 <=> 3.1]
        //>>>>>>> i create a version of the variation (a part of it) that starts in the very start and ends by the number.zone.endIndex that is being checked, than I send this part to check it against the list of numbers
        //>>>>>>>> voila, now i can use Number.prototype.combinationIsValid() (just gotta modify it so it acceptss an argument 'numberFormat')
        /*
        while(currentNumberIndex !== -1) {
            let currentNumber = this.numbers[currentNumberIndex];
            if (currentNumber.succeedingNumbers[0]) {
                //[EXPLENATION] if there are no more combinations, return one level up + reset currentCombinationIndex
                if (currentNumber.combinations[currentNumber.currentCombinationIndex + 1]) {
                    currentNumber.currentCombinationIndex++;
                    combinationSet.splice(currentNumberIndex, 1, currentNumber.combinations[currentNumber.currentCombinationIndex]);
                    currentNumberIndex++;
                }
                else {
                    currentNumber.currentCombinationIndex = -1;
                    currentNumberIndex--;
                }
            }
            else {
                for(const combination of currentNumber.combinations) {
                    combinationSet.splice(currentNumberIndex, 1, combination);
                    combinationSets.push([...combinationSet]);
                }
                currentNumberIndex--;
            }
        }
*/
        return combinationSets;

    }
}

class Number {
    constructor(value, precedingNumbers, succeedingNumbers, symbolRow) {
        this.value = value;
        this.precedingNumbers = [...precedingNumbers];
        this.succeedingNumbers = [...succeedingNumbers];
        this.symbolRow = symbolRow;
        this.zone = this.getZone();
        this.combinations = this.getCombinations();
    }
    getZone() {
        //up my reduce-game? i could define a function that i would pass in as a callback (reduce redunduncy - haha reduce; i know.)
        let zoneStart = (this.precedingNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + this.precedingNumbers.length);
        let zoneEnd = this.symbolRow.length - (this.succeedingNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + this.succeedingNumbers.length);
        return {
            startIndex: zoneStart,
            endIndex: zoneEnd - 1,
            numberOfCombinations: (zoneEnd - zoneStart) - this.value + 1
            //wiggleSpace: (zoneEnd - zoneStart) - this.value,
            // numberOfCombinations: wiggleSpace + 1
        };
    }
    getCombinations() {
        let result = [];
        for(let i = 0; i < this.zone.numberOfCombinations; i++) {
            let symbolRowVariation = [...this.symbolRow];
            let sequenceStartIndex = this.zone.startIndex + i;
            const removedSymbols = symbolRowVariation.splice(sequenceStartIndex, this.value, getHashtagString(this.value));
            if (removedSymbols.indexOf('.') !== -1) {
                continue;
            }
            symbolRowVariation = symbolRowVariation.join('');
            //TODO validate variation
           if (this.combinationIsValid(symbolRowVariation, sequenceStartIndex, sequenceStartIndex + this.value - 1)) {
               result.push(symbolRowVariation);
           }
        }
        return result;
    }
    combinationIsValid(symbolRowVariation, sequenceStartIndex, sequenceEndIndex) {
        return (symbolRowVariation[sequenceStartIndex - 1] !== '#') && (symbolRowVariation[sequenceEndIndex + 1] !== '#');
    }
}

function bubbleSortByNumberOfCombinations(a, b) {
    if (a.combinations.length > b.combinations.length) {
        return 1;
    } else if (a.combinations.length < b.combinations.length) {
        return -1;
    } else {
        return 0;
    }
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
    return (char === '#');
}

function getHashtagString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += '#';
    }
    return result;
}

function initArray(length) {
    let array = [];
    for(let i = 0; i < length; i++) {
        array.push('');
    }
    return array;
}

main();