const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(newFunction(extractLinesFromInputFile()));
}

function newFunction(lines) {
    const seeds = [];
    let map = {
        name: '',
        coordinates: [{ 
            destinationRangeStart: 0,
            sourceRangeStart: 0,
            rangeLength: 0,
        }]
    }
    const seedsDeclaration = 'seeds: ';
    const seedToSoilDeclaration = 'seed-to-soil map:';
    const soilToFertilizerDeclaration = 'soil-to-fertilizer map:';
    const fertilizerToWaterDeclaration = 'fertilizer-to-water map:';
    const waterToLightDeclaration = 'water-to-light map:';
    const lightToTemperatureDeclaration = 'light-to-temperature map:';
    const temperatureToHumidityDeclaration = 'temperature-to-humidity map:';
    const humidityToLocationDeclaration = 'humidity-to-location map:';
    
    
    for(const line of lines) { 
        if (line.includes('seeds')) { line.slice(line.indexOf('seeds: ')) }
    }
}




function extractSeeds(line) {

}