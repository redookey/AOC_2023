const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(solvePuzzle(extractLinesFromInputFile()));
}

//shouldnt there be parseInt somewhere? (part2 as well)
class Race {
    constructor(availableTime, recordDistance) {
        this.availableTime = availableTime;
        this.recordDistance = recordDistance;
    }
    numberOfWaysToWin() {
        let waysToWin = 0;
        for(let i = 0; i <= this.availableTime; i++) {
            let speed = i;
            let remainingTime = this.availableTime - i;
            if (speed * remainingTime > this.recordDistance) { waysToWin++; }
        }
        return waysToWin;
    }
    
}

function solvePuzzle(lines) {
    const times = lines[0].slice(lines[0].indexOf(':') + 1).trim().split(' ').filter((e) => e);
    const distances = lines[1].slice(lines[1].indexOf(':') + 1).trim().split(' ').filter((e) => e);
    let result = 0;

    for(let i = 0; i < times.length; i++) {
        let waysToWinRace = new Race(times[i], distances[i]).numberOfWaysToWin();
        if (result) { result *= waysToWinRace; }
        else { result = waysToWinRace; }
    }
    return result;
}

main();