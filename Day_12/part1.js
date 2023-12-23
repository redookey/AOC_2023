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
    
    console.log();
}

function getConditionRecords(lines) {
    let conditionRecords = [];
    for(const line of lines) {
        let splitLine = line.split(' ');
        conditionRecords.push(new ConditionRecord(splitLine[0], splitLine[1]));
    }
    return conditionRecords;
}

class ConditionRecord {
    constructor(symbolFormat, numberFormat) {
        this.symbolFormat = symbolFormat;
        this.numberFormat = numberFormat;
        this.initNumbers();
    }
    initNumbers() {
        this.numbers = [];
        let numbers = [];
        numbers = this.numberFormat.split(',');
        for(let i = 0; i < numbers.length; i++) {
            this.numbers.push(new Number(parseInt(numbers[i]), numbers.slice(0, i).map(element => parseInt(element)), numbers.slice(i + 1, numbers.length).map(element => parseInt(element)), this.symbolFormat));
        }
    }
    initCompatibleVariations() {
        this.numbers

        //CONTINUE HERE
    }

}

class Number {
    constructor(value, precedingNumbers, succeedingNumbers, symbolRow) {
        this.value = value;
        this.precedingNumbers = [...precedingNumbers];
        this.succeedingNumbers = [...succeedingNumbers];
        this.symbolRow = symbolRow;
        this.initZone();
        this.initCombinations();
    }
    initZone() {
        //up my reduce-game? i could define a function that i would pass in as a callback (reduce redunduncy - haha reduce; i know.)
        let zoneStart = (this.precedingNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + this.precedingNumbers.length);
        let zoneEnd = this.symbolRow.length - (this.succeedingNumbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + this.succeedingNumbers.length);
        this.zone = {
            startIndex: zoneStart,
            endIndex: zoneEnd - 1,
            numberOfCombinations: (zoneEnd - zoneStart) - this.value + 1
            //wiggleSpace: (zoneEnd - zoneStart) - this.value,
            // numberOfCombinations: wiggleSpace + 1
        }
    }
    initCombinations() {
        this.combinations = [];
        for(let i = 0; i < this.zone.numberOfCombinations; i++) {
            let symbolRowVariation = [...this.symbolRow];
            let sequenceStartIndex = this.zone.startIndex + i;
            symbolRowVariation.splice(sequenceStartIndex, this.value, getHashtagString(this.value));
            symbolRowVariation = symbolRowVariation.join('');
           if (this.combinationIsValid(symbolRowVariation, sequenceStartIndex, sequenceStartIndex + this.value - 1)) {
               this.combinations.push(symbolRowVariation);
           }
        }
    }
    combinationIsValid(symbolRowVariation, sequenceStartIndex, sequenceEndIndex) {
        return (symbolRowVariation[sequenceStartIndex - 1] !== '#') && (symbolRowVariation[sequenceEndIndex + 1] !== '#');
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