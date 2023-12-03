const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(getSumOfGearRatios(extractLinesFromInputFile()));
}

function getSumOfGearRatios(lines) {
    const emptyLine = '............................................................................................................................................';
    let sumOfGearRatios = 0;

    lines.unshift(emptyLine);
    lines.push(emptyLine);

    for(let lineNo = 0; lineNo < lines.length; lineNo++) {
        let aboveLine = lines[lineNo - 1];
        let belowLine = lines[lineNo + 1];
        let currentLine = lines[lineNo];

        sumOfGearRatios += getLineTotal(currentLine, aboveLine, belowLine);
    }
    return sumOfGearRatios;
}

function getLineTotal(currentLine, aboveLine, belowLine) {
    let lineTotal = 0;
    for(let charPosition = 0; charPosition < currentLine.length; charPosition++) {
        let partNumbers = [];
        if(isGear(currentLine[charPosition])) {
            partNumbers = partNumbers.concat(getCurrLinePartNumbers(currentLine, charPosition));
            partNumbers = partNumbers.concat(getAdjLinePartNumbers(aboveLine, charPosition));
            partNumbers = partNumbers.concat(getAdjLinePartNumbers(belowLine, charPosition));
            if (partNumbers.length === 2) { lineTotal += partNumbers[0] * partNumbers[1]; }
        }
    }
    return lineTotal;
}

function getCurrLinePartNumbers(currLine, gearPosition) {
    let partNumbers = [];
    let partNumber = 0;

    if (isDigit(currLine[gearPosition - 1])) {
         partNumbers.push(getNumberOnLeftSide(currLine, gearPosition - 1))
    }
    if (isDigit(currLine[gearPosition + 1])) {
        partNumbers.push(getNumberOnRightSide(currLine, gearPosition + 1))
    }
    return partNumbers;
}

function getAdjLinePartNumbers(adjLine, gearPosition) {
    let partNumbers = [];

    if (isDigit(adjLine[gearPosition])) {
        partNumbers.push(getNumberOnAdjLine(adjLine, gearPosition));
        return partNumbers;
    }
    if (isDigit(adjLine[gearPosition - 1])) { partNumbers.push(getNumberOnLeftSide(adjLine, gearPosition - 1)); }
    if (isDigit(adjLine[gearPosition + 1])) { partNumbers.push(getNumberOnRightSide(adjLine, gearPosition + 1)); }
    return partNumbers;
}

function getNumberOnLeftSide(line, numberPosition) {
    let partNumber = '';

    for(let i = numberPosition; isDigit(line[i]); i--) {
        partNumber = line[i] + partNumber; //add to the beginning
    }
    return parseInt(partNumber);
}

function getNumberOnRightSide(line, numberPosition) {
    let partNumber = '';

    for(let i = numberPosition; isDigit(line[i]); i++) {
        partNumber += line[i];
    }
    return parseInt(partNumber);
}

function getNumberOnAdjLine(adjLine, numberPosition) {
    let firstPart = '';
    let secondPart = '';

    for(let i = numberPosition; isDigit(adjLine[i]); i--) {
        firstPart = adjLine[i] + firstPart;
    }
    for(let i = numberPosition; isDigit(adjLine[i]); i++) {
        secondPart += adjLine[i];
    }

    return parseInt(firstPart.concat(secondPart.slice(1)));
}

function isGear(char) {
    return (char === '*');
}

function isDigit(char) {
    const digits = '0123456789';
    for(const digit of digits) {
        if(char == digit) { return true; } 
    }
    return false;
}

main();