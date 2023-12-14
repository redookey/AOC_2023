const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractLinesFromInputFile()));
    const end = Date.now();
    console.log(`start: ${start}\nend: ${end}`);
}

function solvePuzzle(lines) {
    lines = duplicateEmptyRowsAndColumns(lines);
    const galaxies = getGalaxies(lines);
    let totalDistance = 0;
    for(let galaxyNo = 0; galaxyNo < galaxies.length; galaxyNo++) {
        for(let galaxyToCompareNo = galaxyNo + 1; galaxyToCompareNo < galaxies.length; galaxyToCompareNo++) {
            totalDistance += getDistanceBetweenGalaxies(galaxies[galaxyNo], galaxies[galaxyToCompareNo]);
        }
    }
    return totalDistance;
}

function duplicateEmptyRowsAndColumns(lines) { 
    lines = duplicateEmptyLines(lines);
    lines = rotateLines(duplicateEmptyLines(rotateLines(lines)));
    return lines;
}

function duplicateEmptyLines(lines) {
    for(let i = 0; i < lines.length; i++) {
        if (!lines[i].includes('#')) {
            lines.splice(i, 0, lines[i]);
            i++;
        }
    }
    return lines;
}

function rotateLines(lines) {
    let rotatedLines = [];
    const lineLength = lines[0].length;
    
    for(let i = 0; i < lineLength; i++) {
        let rotatedLine = '';
        for(const line of lines) {
            rotatedLine += line[i];
        }
        rotatedLines.push(rotatedLine);
    }
    return rotatedLines;
}

function getDistanceBetweenGalaxies(galaxy1, galaxy2) {
    return Math.abs(galaxy1.rowNumber - galaxy2.rowNumber) + Math.abs(galaxy1.columnNumber - galaxy2.columnNumber);
}

function getGalaxies(galaxyMap) {
    let galaxies = [];
    for(let lineNo = 0; lineNo < galaxyMap.length; lineNo++) {
        for(let columnNo = 0; columnNo < galaxyMap[lineNo].length; columnNo++) {
            if (galaxyMap[lineNo][columnNo] === '#') { galaxies.push(new Galaxy(lineNo, columnNo)); }
        }
    }
    return galaxies;
}

class Galaxy {
    constructor(rowNumber, columnNumber) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
    }
}

main();