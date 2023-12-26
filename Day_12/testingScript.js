const fs = require('fs');
const originalVersion = require('./part1');
const newVersion = require('./part2-mix');

function extractLinesFromInputFile(fileName) {
    const data = fs.readFileSync(__dirname + '/' + fileName, 'utf8');
    return data.split(`\n`);
}

function main() {
    originalVersion.main;
    newVersion.main;

    let originalLines = extractLinesFromInputFile('testOriginal.txt');
    let newLines = extractLinesFromInputFile('testNew.txt');
    let extraLines = [];
    let missingLines = [];
    
    for(const newLine of newLines) {
        if (!originalLines.find(value => value === newLine)) {
            extraLines.push(newLine);
        }
    }

    for(const originalLine of originalLines) {
        if (!newLines.find(value => value === originalLine)) {
            missingLines.push(originalLine);
        }
    }

    printResult(extraLines, missingLines);
}

function printResult(extraLines, missingLines) {
    let result = [];

    result.push(`Extra Lines:\n`);
    for(const extraLine of extraLines) {
        result.push(extraLine);
    }

    result.push(`\n\nMissing Lines:\n`);
    for(const missingLine of missingLines) {
        result.push(missingLine);
    }

    fs.writeFileSync(__dirname + '/differences.txt', result.join(`\n`));
}

main();