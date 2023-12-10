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
    return speciments.reduce((accumulator, currentValue) => accumulator + currentValue.previousValue, 0);
}

class Speciment {
    constructor(historyValues) {
        this.historyValues = historyValues.map(value => parseInt(value));
        this.previousValue = this.getNewValue('previous');
        this.nextValue = this.getNewValue('next');
    }
    getHistoryLevels() {
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
    getNewValue(direction) {
        let historyLevels = this.getHistoryLevels();
        for(let i = historyLevels.length - 1; i > 0; i--) {
            const currentHistoryLevel = historyLevels[i];
            let upperHistoryLevel = historyLevels[i - 1];
            if ('previous') { upperHistoryLevel.unshift(upperHistoryLevel[0] - currentHistoryLevel[0]); }
            if ('next') { upperHistoryLevel.push(currentHistoryLevel[currentHistoryLevel.length - 1] + upperHistoryLevel[upperHistoryLevel.length - 1]); }
        }
        const firstHistoryLevel = historyLevels[0];
        if ('previous') { return firstHistoryLevel[0]; }
        if ('next') { return firstHistoryLevel[firstHistoryLevel.length - 1]; }
    }
}

main();