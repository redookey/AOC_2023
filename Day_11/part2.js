const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractLinesFromInputFile()));
    const end = Date.now();
    console.log(`${(end - start) / 1000}s`);
}

function solvePuzzle(lines) {
    const translatedMap = translateBaseMap(lines);
    const barebonesRowMap = getBarebonesMapWithDuplicatedEmptyLines(translatedMap);
    const barebonesColumnMap = getBarebonesMapWithDuplicatedEmptyLines(getRotatedLines(translatedMap));

    let galaxies = getGalaxies(translatedMap);
    updateGalaxiesRowNos(barebonesRowMap, galaxies);
    updateGalaxiesColumnNos(barebonesColumnMap, galaxies);

    return getTotalDistance(galaxies);
}

function getTotalDistance(galaxies) {
    let totalDistance = 0;
    for(let galaxyNo = 0; galaxyNo < galaxies.length; galaxyNo++) {
        for(let galaxyToCompareNo = galaxyNo + 1; galaxyToCompareNo < galaxies.length; galaxyToCompareNo++) {
            totalDistance += getDistanceBetweenGalaxies(galaxies[galaxyNo], galaxies[galaxyToCompareNo]);
        }
    }
    return totalDistance;
}

function getDistanceBetweenGalaxies(galaxy1, galaxy2) {
    return Math.abs(galaxy1.rowNumber - galaxy2.rowNumber) + Math.abs(galaxy1.columnNumber - galaxy2.columnNumber);
}

function translateBaseMap(baseMapLines) {
    //in javaScript you can store different dataTypes in a single array (otherwise i'd just make a "Dot class")
    let translatedMap = [];
    let galaxyNo = 0;
    for(let lineNo = 0; lineNo < baseMapLines.length; lineNo++) {
        translatedMap.push(baseMapLines[lineNo].split(''));
        for(let columnNo = 0; columnNo < translatedMap[lineNo].length; columnNo++) {
            if (translatedMap[lineNo][columnNo] === '#') {
                translatedMap[lineNo][columnNo] = new Galaxy(galaxyNo);
                galaxyNo++;
            }
        }
    }
    return translatedMap;
}

function getGalaxies(map) {
    let galaxies = [];
    
    for(let lineNo = 0; lineNo < map.length; lineNo++) {
        for(let columnNo = 0; columnNo < map[lineNo].length; columnNo++) {
            if(typeof map[lineNo][columnNo] === 'object') { galaxies.push(map[lineNo][columnNo]); }
        }
    }
    return galaxies;
}

function updateGalaxiesRowNos(barebonesRowMap, galaxies) {
    for(let lineNo = 0; lineNo < barebonesRowMap.length; lineNo++) {
        for(let columnNo = 0; columnNo < barebonesRowMap[lineNo].length; columnNo++) {
            if(typeof barebonesRowMap[lineNo][columnNo] === 'object') {
                const foundGalaxy = barebonesRowMap[lineNo][columnNo];
                galaxies.find((galaxy) => galaxy.id === foundGalaxy.id).updateRowNo(lineNo);
            }
        }
    }
}

function updateGalaxiesColumnNos(barebonesColumnsMap, galaxies) {
    for(let lineNo = 0; lineNo < barebonesColumnsMap.length; lineNo++) {
        for(let columnNo = 0; columnNo < barebonesColumnsMap[lineNo].length; columnNo++) {
            if(typeof barebonesColumnsMap[lineNo][columnNo] === 'object') {
                const foundGalaxy = barebonesColumnsMap[lineNo][columnNo];
                galaxies.find((galaxy) => galaxy.id === foundGalaxy.id).updateColumnNo(lineNo);
            }
        }
    }
}

function getRotatedLines(lines) {
    const lineLength = lines[0].length;
    let rotatedLines = [];
    
    for(let columnNo = 0; columnNo < lineLength; columnNo++) {
        let rotatedLine = [];
        for(const line of lines) {
            rotatedLine.push(line[columnNo]);
        }
        rotatedLines.push(rotatedLine);
    }
    return rotatedLines;
}

function getBarebonesMapWithDuplicatedEmptyLines(lines) {
    //EXPLANATION: array is a reference type, (it would get changed without returning and re-assigning the value) so I need to make a copy of the array (a new reference) that doesn't point to the same spot in memory
    let linesLocal = [...lines];
    for(let i = 0; i < linesLocal.length; i++) {
        if (!arrayIncludesAnObject(linesLocal[i])) {
            for(let j = 1; j < 1000000; j++) {
                linesLocal.splice(i, 0, linesLocal[i]);
                i++;
                }
            }
        }
    linesLocal = linesLocal.map(subArray =>
        subArray.filter(element => typeof element === 'object')
    );
    return linesLocal;
}

//NOTE: i could get fancy and extend the array.prototype with an equivalent of this function 'includesObject() -> boolean'
function arrayIncludesAnObject(array) {
    for(let i = 0; i < array.length; i++) {
        if(typeof array[i] === 'object') { return true; }
    }
    return false;
}

class Galaxy {
    constructor(id) {
        this.id = id;
    }
    updateColumnNo(columnNumber) {
        this.columnNumber = columnNumber;
    }
    updateRowNo(rowNumber) {
        this.rowNumber = rowNumber;
    }
}

main();