const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractLinesFromInputFile()));
    const end = Date.now();
    console.log(`start: ${start}\nend: ${end}`);
}

function solvePuzzle(lines) {
    let speciments = [];
    for(const line of lines) {
        speciments.push(new Speciment(line.split(' ')));
    }
    return speciments.reduce((accumulator, currentValue) => accumulator + currentValue.nextValue, 0);
}

class Speciment {
    constructor(historyValues) {
        this.historyValues = historyValues.map(value => parseInt(value));
        this.nextValue = this.getNextValue();
    }
    getHistoryLevels() {
        //EXPLANATION: array is a reference type, (it would get changed without returning and re-assigning the value) so I need to make a copy of the array (a new reference) that doesn't point to the same spot in memory
        let changesInHistoryUpper = [...this.historyValues];
        let changesInHistoryInner = [];
        let historyLevels = [];
        while(changesInHistoryInner.some(value => value) || changesInHistoryInner.length === 0) {
            changesInHistoryInner = [];
            for(let i = 0; i < changesInHistoryUpper.length - 1; i++) {
                changesInHistoryInner.push(changesInHistoryUpper[i + 1] - changesInHistoryUpper[i]);
            }
            historyLevels.push(changesInHistoryUpper);
            changesInHistoryUpper = [...changesInHistoryInner];
        }
        historyLevels.push(changesInHistoryUpper);

        return historyLevels;
    }
    getNextValue() {
        let historyLevels = this.getHistoryLevels();
        for(let i = historyLevels.length - 1; i > 0; i--) {
            const currentHistoryLevel = historyLevels[i];
            let upperHistoryLevel = historyLevels[i - 1];
            upperHistoryLevel.push(currentHistoryLevel[currentHistoryLevel.length - 1] + upperHistoryLevel[upperHistoryLevel.length - 1]);
        }
        const firstHistoryLevel = historyLevels[0];
        return firstHistoryLevel[firstHistoryLevel.length - 1];
    }
}

main();