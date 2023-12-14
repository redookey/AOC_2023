const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/testInput.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractLinesFromInputFile()));
    const end = Date.now();
    console.log(`${(end - start) / 1000}s`);
}

function solvePuzzle(lines) {
    let extendedRows = duplicateEmptyLines(lines);
    let galaxies = getGalaxies(extendedRows);
    let extendedColumns = rotateLines(lines);
    extendedColumns = duplicateEmptyLines(extendedColumns);
    extendedColumns = rotateLines(extendedColumns);
    updateGalaxiesColumns(extendedColumns, galaxies);
    
    let totalDistance = 0;
    for(let galaxyNo = 0; galaxyNo < galaxies.length; galaxyNo++) {
        for(let galaxyToCompareNo = galaxyNo + 1; galaxyToCompareNo < galaxies.length; galaxyToCompareNo++) {
            totalDistance += getDistanceBetweenGalaxies(galaxies[galaxyNo], galaxies[galaxyToCompareNo]);
        }
    }
    return totalDistance;
}

function getGalaxies(galaxyMap) {
    let galaxies = [];
    for(let lineNo = 0; lineNo < galaxyMap.length; lineNo++) {
        for(let columnNo = 0; columnNo < galaxyMap[lineNo].length; columnNo++) {
            if (galaxyMap[lineNo][columnNo] === '#') { galaxies.push(new Galaxy(lineNo)); }
        }
    }
    return galaxies;
}

function updateGalaxiesColumns(galaxyMap, galaxies) {
    let galaxyNo = 0;
    for(let lineNo = 0; lineNo < galaxyMap.length; lineNo++) {
        for(let columnNo = 0; columnNo < galaxyMap[lineNo].length; columnNo++) {
            if (galaxyMap[lineNo][columnNo] === '#') {
                galaxies[galaxyNo].updateColumnNo(columnNo);
                galaxyNo++;
            }
        }
    }
}

function duplicateEmptyLines(lines) {
    let linesLocal = [...lines];
    for(let i = 0; i < linesLocal.length; i++) {
        linesLocal[i] = linesLocal[i].replaceAll('.', '');
        if (!linesLocal[i].includes('#')) {
            // for(let j = 1; j < 10; j++) {
                linesLocal.splice(i, 0, linesLocal[i]);
                i++;
            // }
        }
    }
    deleteDots(linesLocal);
    return linesLocal;
}

function deleteDots(lines) {
    for(let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replaceAll('.', '');
    }
    return lines;
}

function rotateLines(lines) {
    let rotatedLines = [];
    const lineLength = lines[0].length;
    
    for(let i = 0; i < lineLength; i++) {
        let rotatedLine = '';
        for(const line of lines) {
            if (line[i]) { rotatedLine += line[i]; }
            else { rotatedLine += ' '; }
        }
        rotatedLines.push(rotatedLine);
    }
    return rotatedLines;
}

function getDistanceBetweenGalaxies(galaxy1, galaxy2) {
    return Math.abs(galaxy1.rowNumber - galaxy2.rowNumber) + Math.abs(galaxy1.columnNumber - galaxy2.columnNumber);
}

class Galaxy {
    constructor(rowNumber) {
        this.rowNumber = rowNumber;
    }
    updateColumnNo(columnNumber) {
        this.columnNumber = columnNumber;
    }
}

main();