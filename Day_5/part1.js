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
    let maps = [];

    for(const section of sections) {
        let sectionLines = section.split('\r\n');
        const declaration = sectionLines.shift();
        sectionLines.forEach((value, index, array) => array[index] = value.split(' '));
        maps.push(new Map(declaration, sectionLines));
    }
}

main();


        // const seedToSoilDeclaration = 'seed-to-soil map:';
        // const soilToFertilizerDeclaration = 'soil-to-fertilizer map:';
        // const fertilizerToWaterDeclaration = 'fertilizer-to-water map:';
        // const waterToLightDeclaration = 'water-to-light map:';
        // const lightToTemperatureDeclaration = 'light-to-temperature map:';
        // const temperatureToHumidityDeclaration = 'temperature-to-humidity map:';
        // const humidityToLocationDeclaration = 'humidity-to-location map:';
        // switch(section.slice(0, section.indexOf(':') + 1)) {
        //     case seedToSoilDeclaration: {
        //         maps.push(new Map(section, seedToSoilDeclaration));
        //         break;
        //     }
        //     case soilToFertilizerDeclaration: {
        //         maps.push(new Map(section, soilToFertilizerDeclaration));
        //         break;
        //     }
        //     case fertilizerToWaterDeclaration: {
        //         maps.push(new Map(section, fertilizerToWaterDeclaration));
        //         break;
        //     }
        //     case waterToLightDeclaration: {
        //         maps.push(new Map(section, waterToLightDeclaration));
        //         break;
        //     }
        //     case lightToTemperatureDeclaration: {
        //         maps.push(new Map(section, lightToTemperatureDeclaration));
        //         break;
        //     }
        //     case temperatureToHumidityDeclaration: {
        //         maps.push(new Map(section, temperatureToHumidityDeclaration));
        //         break;
        //     }
        //     case humidityToLocationDeclaration: {
        //         maps.push(new Map(section, humidityToLocationDeclaration));
        //         break;
        //     }
        // }