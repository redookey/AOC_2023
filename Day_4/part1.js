const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(getTotal(extractLinesFromInputFile()));
}

function getTotal(lines) {
    for(const line of lines) {
        const numberGroups = line.slice(line.indexOf(':') + 1).split('|');
        const winningNumbers = numberGroups[0].trim().split(' ').filter((word) => word != '');
        const myNumbers = numberGroups[1].trim().split(' ').filter((word) => word != '');
        let lineTotal = 0;

        for(number in myNumbers) {
            if (winningNumbers.includes(number)) {
                if (lineTotal === 0) { lineTotal = 1; }
                else { lineTotal *= 2; }
            }
        }
    }
}

function test() {
    const line = 'Card   1: 27 61 49 69 58 44  2 29 39 10 | 97 96 49 78 26 58 27 77 69  9 39 88 53 10  2 29 61 62 48 87 18 44 74 34 11' 
    const numberGroups = line.slice(line.indexOf(':') + 1).split('|');
    console.log(numberGroups);
    let winningNumbers = numberGroups[0].trim().split(' ').filter((word) => word != '');
    let myNumbers = numberGroups[1].trim().split(' ');
    // winningNumbers = winningNumbers.filter((word) => word != '');
    myNumbers = myNumbers.filter((word) => word != '');
    console.log(winningNumbers);
    console.log(myNumbers);
    
}

test();
// main();