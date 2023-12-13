const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/testInput.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractLinesFromInputFile()));
    const end = Date.now();
    console.log(`start: ${start}\nend: ${end}`);
}

function solvePuzzle(lines) {
    lines = duplicateRowsWithoutGalaxies(lines);
    lines = duplicateColumnsWithoutGalaxies(lines);
    // fs.writeFileSync(__dirname + '/test.txt', lines.join(`\n`));
}

function duplicateRowsWithoutGalaxies(lines) {
    for(let i = 0; i < lines.length; i++) {
        if (!lines[i].includes('#')) {
            lines.splice(i, 0, lines[i]);
            i++;
        }
    }
    return lines;
}

function duplicateColumnsWithoutGalaxies(rows) {
    let columns = [];
    const rowLength = rows[0].length;
    
    for(let i = 0; i < rowLength; i++) {
        let column = '';
        for(const row of rows) {
            column += row[i];
        }
        columns.push(column);
    }
    fs.writeFileSync(__dirname + '/test.txt', columns.join(`\n`));
    return columns;
}

function test() {
    let myArray = [1, 2, 3, 5, 6];

    for(let i = 0; i < myArray.length; i++) {
        let test = myArray[i];
        if (myArray[i] === 3) {
            myArray.splice(i, 0, myArray[i]);
            i++;
        }
    }
    
    console.log(myArray); // Output: [1, 2, 3, 4, 5, 6]
}

main();