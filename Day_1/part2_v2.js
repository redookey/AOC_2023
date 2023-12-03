const fs = require('fs');

function main() {
    console.log(sortThisElfMessOut(extractLinesFromInputFile()));
}

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function sortThisElfMessOut(calibrationData) {
    let result = 0;
    for(const line of calibrationData) {
        result += calculateLine(line);
    }
    return result;
}

function calculateLine(calibrationLine) {
    return parseInt(getFirstDigit(calibrationLine).toString() + getLastDigit(calibrationLine).toString());
}

function getFirstDigit(calibrationLine) {
    for(let position = 0; position < calibrationLine.length; position++) {
        let digit = getDigit(calibrationLine, position);
        if (digit) { return digit; }
    }
}

function getLastDigit(calibrationLine) {
    for(let position = calibrationLine.length; position >= 0; position--) {
        let digit = getDigit(calibrationLine, position);
        if (digit) { return digit; }
    }
}

function getDigit(calibrationLine, position) {
    if (isDigit(calibrationLine[position])) { return parseInt(calibrationLine[position]); }
    return isSpelledOutDigit(calibrationLine.slice(position));
}

function isDigit(char) {
    const digits = '0123456789';
    for(const digit of digits) {
        if(char == digit) {
            return true;
        } 
    }
    return false;
}

function isSpelledOutDigit(str) {
    const spelledOutDigits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    for(const digit of spelledOutDigits) {
        if (str.indexOf(digit) === 0) {
            return (spelledOutDigits.indexOf(digit) + 1);
        }
    }
    return 0;
}

main();