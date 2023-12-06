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
        nearestLocation = updateNearestLocation(nearestLocation, new SeedSet(parseInt(seedsCoordinates[i]), parseInt(seedsCoordinates[i + 1])).getNearestLocation(maps));
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

function updateNearestLocation(nearestLocation, location) {
    if (nearestLocation !== null) { if (nearestLocation > location) { return location } }
    else { return location }
    return nearestLocation;
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
    getNearestLocation(maps) {
        let nearestLocation = null;
    	for(let i = 0; i <= this.numberOfSeeds; i++) {
            nearestLocation = updateNearestLocation(nearestLocation, getNearestLocationForSeed(this.firstSeed + i, maps));
        }
        return nearestLocation;
    }
}
function getNearestLocationForSeed(seed, maps) {
    let translationValue = seed; 
    for(const map of maps) {
        translationValue = map.getCorrespondingValue(translationValue);
    }
    return translationValue;
}

const start = Date.now();
main();
const end = Date.now();

console.log(`start: ${start}\nend:${end}`);