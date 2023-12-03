const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(getSumOfPartNumbers(extractLinesFromInputFile()));
}

function getSumOfPartNumbers(lines) {
    const emptyLine = '............................................................................................................................................';
    let sumOfParts = 0;

    lines.unshift(emptyLine);
    lines.push(emptyLine);

    for(let lineNo = 0; lineNo < lines.length; lineNo++) {
        let aboveLine = lines[lineNo - 1];
        let belowLine = lines[lineNo + 1];
        let currentLine = lines[lineNo];

        let lineCheck = getLineTotal(currentLine, aboveLine, belowLine);
        sumOfParts += getLineTotal(currentLine, aboveLine, belowLine);
    }
    return sumOfParts;
}

function getLineTotal(currentLine, aboveLine, belowLine) {
    let partNumber = { value: '', start: 0, end: 0 };
    let lineTotal = 0;
    for(let position = 0; position < currentLine.length; position++) {
        if (isDigit(currentLine[position])) {
            partNumber.start = position;
            partNumber.value = getNumber(currentLine, position);
            partNumber.end = position + partNumber.value.length - 1;
            
            lineTotal += getNumberIfValid(partNumber, currentLine, aboveLine, belowLine);
            position = partNumber.end + 1;
        }
    }
    return lineTotal;
}

function getNumber(str, position) {
    let result = '';
    for(let i = position; isDigit(str[i]); i++) {
        result += str[i];
    }
    return result;
}

function getNumberIfValid(partNumber, currentLine, aboveLine, belowLine) {
    if (symbolOnCurrentLine(partNumber, currentLine)) { return parseInt(partNumber.value); }
    if (symbolOnAdjacentLine(partNumber, aboveLine)) { return parseInt(partNumber.value); }
    if (symbolOnAdjacentLine(partNumber, belowLine)) { return parseInt(partNumber.value); }
    return 0;
}

function symbolOnCurrentLine(partNumber, currentLine) {
    if (isSymbol(currentLine[partNumber.start - 1])) { return true; }
    if (isSymbol(currentLine[partNumber.end + 1])) { return true; }
    return false;
}

function symbolOnAdjacentLine(partNumber, adjacentLine) {
    for(let position = partNumber.start - 1; position <= partNumber.end + 1; position++) {
        if (isSymbol(adjacentLine[position])) { return true; }
    }
    return false;
}

function isDigit(char) {
    const digits = '0123456789';
    for(const digit of digits) {
        if(char == digit) { return true; } 
    }
    return false;
}

function isSymbol(char) {
    if(!char || isDot(char)) { return false; }
    return true;
}

function isDot(char) {
    return (char === '.');
}

main();