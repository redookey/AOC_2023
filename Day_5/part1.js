const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split('\r\n\r\n');
}

function main() {
    console.log(newFunction(extractLinesFromInputFile()));
}

class Map {
    constructor(declaration, coordinatesSets) {
        this.declaration = declaration;
        this.coordinates = [];
        for(const coordinatesSet of coordinatesSets) {
            this.coordinates.push({
                destinationRangeStart: coordinatesSet[0],
                sourceRangeStart: coordinatesSet[1],
                rangeLength: coordinatesSet[2]  
            })
        }
    }
}

function newFunction(sections) {
    const seedsDeclaration = 'seeds: ';
    const seeds = sections.shift().slice(seedsDeclaration.length).trim().split(' ');
    const maps = formatMaps(sections);
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