const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split('\r\n\r\n');
}

function main() {
    console.log(getNearestLocation(extractLinesFromInputFile()));
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

class Seed {
    constructor(firstSeed, numberOfSeeds) {
        this.firstSeed = firstSeed;
        this.numberOfSeeds = numberOfSeeds; 
    }   
    getSeeds() {
        let seeds = [];
        for(let i = 0; i <= this.numberOfSeeds; i++) {
            seeds.push(this.firstSeed + i);
        }
        return seeds;
    }
}

function getNearestLocation(sections) {
    const seedsDeclaration = 'seeds: ';
    const seedsCoordinates = sections.shift().slice(seedsDeclaration.length).trim().split(' ');
    const maps = formatMaps(sections);
    let seeds = [];
    let locations = [];

    for(let i = 0; i < seedsCoordinates.length; i = i + 2) {
        seeds.push(...new Seed(parseInt(seedsCoordinates[i]), parseInt(seedsCoordinates[i + 1])).getSeeds());
    }

    for(const seed of seeds) {
        let valueToTranslate = parseInt(seed);
        for(const map of maps) {
            valueToTranslate = map.getCorrespondingValue(valueToTranslate);
        }
        locations.push(valueToTranslate);
    }

    return Math.min(...locations);
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

main();