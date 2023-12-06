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
        let overflowCounter = 0;
        let seeds = [];
        let seedsVault = []
        // let seedsVaultLength = 0;
        for(let i = 0; i <= this.numberOfSeeds; i++) {
            if (overflowCounter === 1000000) {
                seedsVault.push([...seeds]);
                seeds = [];
                overflowCounter = 0;
                // seedsVaultLength++;
            } else {
                seeds.push(this.firstSeed + i);
                overflowCounter++;
            }
        }
        seedsVault.push([...seeds]);
        console.log(seedsVault[0][0]);
        console.log(seedsVault[seedsVault.length - 1][seedsVault[seedsVault.length - 1].length - 1]);
        return seedsVault;
    }
}

function getNearestLocation(sections) {
    const seedsDeclaration = 'seeds: ';
    const seedsCoordinates = sections.shift().slice(seedsDeclaration.length).trim().split(' ');
    const maps = formatMaps(sections);
    let setsOfSeeds = [];
    let locations = [];

    for(let i = 0; i < seedsCoordinates.length; i = i + 2) {
        setsOfSeeds.push(new Seed(parseInt(seedsCoordinates[0]), parseInt(seedsCoordinates[1])).getSeeds());
    }

    for(const setOfSeeds of setsOfSeeds) {
        let valueToTranslate = parseInt(setOfSeeds);
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