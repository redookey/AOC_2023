const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(getTotal(extractLinesFromInputFile()));
}

function getTotal(lines) {
    let totalScore = 0;
    for(const line of lines) {
        const numberGroups = line.slice(line.indexOf(':') + 1).split('|');
        const winningNumbers = numberGroups[0].trim().split(' ').filter((word) => word != '');
        const myNumbers = numberGroups[1].trim().split(' ').filter((word) => word != '');
        let lineTotal = 0;

        for(const number in myNumbers) {
            if (winningNumbers.includes(myNumbers[number])) {
                if (lineTotal === 0) { lineTotal = 1; }
                else { lineTotal *= 2; }
            }
        }
        totalScore += lineTotal;
    }
    return totalScore;
}

main();