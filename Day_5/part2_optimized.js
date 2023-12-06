const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split('\r\n\r\n');
}

function main() {
    console.log(getNearestLocation(extractLinesFromInputFile()));
}

function getNearestLocation(sections) {
    const seedsDeclaration = 'seeds: ';
    const seedsCoordinates = sections.shift().slice(seedsDeclaration.length).trim().split(' ');
    const maps = formatMaps(sections);
    let nearestLocation = null;

    for(let i = 0; i < seedsCoordinates.length; i = i + 2) {
        let location = new SeedSet(parseInt(seedsCoordinates[i]), parseInt(seedsCoordinates[i + 1])).getLocation(maps);
        if (nearestLocation !== null) { if (nearestLocation > location) { nearestLocation = location; } }
        else { nearestLocation = location; }
    }
    return nearestLocation;
}

function formatMaps(mapsToFormat) {
    let maps = [];
    for(const mapToFormat of mapsToFormat) {
        let sectionLines = mapToFormat.split('\r\n');
        const declaration = sectionLines.shift();
        sectionLines.forEach((value, index, array) => array[index] = value.split(' '));
        maps.push(new Map(declaration, sectionLines));
    }
    return maps;
}

class Map {
    constructor(declaration, coordinatesSets) {
        this.declaration = declaration;
        this.coordinates = [];
        for(const coordinatesSet of coordinatesSets) {
            this.coordinates.push({
                destinationRangeStart: parseInt(coordinatesSet[0]),
                sourceRangeStart: parseInt(coordinatesSet[1]),
                rangeLength: parseInt(coordinatesSet[2])  
            })
        }
    }
    getCorrespondingValue(valueToTranslate) {
        let matchingValue = 0;
        const coordinate = this.findCorrespondingCoordinate(valueToTranslate);
        if(!coordinate) { return valueToTranslate; }
        matchingValue = valueToTranslate + coordinate.destinationRangeStart - coordinate.sourceRangeStart;

        return matchingValue;
    }
    findCorrespondingCoordinate(value) {
        for(const coordinate of this.coordinates) {
            if (value >= coordinate.sourceRangeStart && value <= coordinate.sourceRangeStart + coordinate.rangeLength - 1) { return coordinate; }
        }
    }
}

class SeedSet {
    constructor(firstSeed, numberOfSeeds) {
        this.firstSeed = firstSeed;
        this.numberOfSeeds = numberOfSeeds; 
    }   
    getLocation(maps) {
        let nearestLocation = null;
    	for(let i = 0; i <= this.numberOfSeeds; i++) {
            let seed = this.firstSeed + i;
            let valueToTranslate = seed;
            for(const map of maps) {
                valueToTranslate = map.getCorrespondingValue(valueToTranslate);
            }
            let location = valueToTranslate;
            if (nearestLocation !== null) { if (nearestLocation > location) { nearestLocation = location; } }
            else { nearestLocation = location; }
        }
        return nearestLocation;
    }
}

main();