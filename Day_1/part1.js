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
    const digitsInLine = digitFilter(calibrationLine);
    return parseInt(digitsInLine.charAt(0) + digitsInLine.charAt(digitsInLine.length - 1));
}

function digitFilter(str) {
    let digits = '';
    for(const char of str) {
        if(isDigit(char)) {
            digits = digits.concat(char);
        }
    }
    return digits;
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

main();