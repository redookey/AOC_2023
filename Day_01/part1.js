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
    //this whole thing can be replaced by a regex expression /[0-9]/ -> (0 - 9) values are declared in order in ASCII
    //maybe make a library or smth? this function is declared way too many times throughout aoc_2023
    const digits = '0123456789';
    return (digits.indexOf(char) !== -1);
    //alternative:
    //return char >= '0' && char <= '9';
}

main();