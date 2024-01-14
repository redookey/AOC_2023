//i can translate the rows to binary
//.#.#..#
//2.4.8.16.32.64.128 
//4 + 16 + 128 = 148

//after that make a horizontal scan
//if it doesnt work out, rotate the patern and try again

//the scan
//if I find two identical numbers, start confirmation
// + save the number of lines to the left (or lines above)
//if the confirmation is successfull, add those numbers to a global variable

//the confirmation
//a cycle ->
//until there is not a next number in one of the directions
//get next number on both sides and compare them
//if they manage to be equal to each other until the end of the cycle, we got it

const fs = require('fs');

function extractBlocksFromFile(fileName) {
    const data = fs.readFileSync(__dirname + '/' + fileName, 'utf8');
    return data.split(`\n\n`);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractBlocksFromFile('testInput.txt')));
    const end = Date.now();
    console.log(`start: ${start}\nend: ${end}`);
}

function solvePuzzle(blocks) {
    let totalLeftSide = 0;
    let totalAbove = 0;
    for (const block of blocks) {
        let blockObject = new Block(block.split(`\n`));
        totalLeftSide += blockObject.numberOfLeftSideLines;
        totalAbove += blockObject.numberOfAboveLines;
    }
    return (totalLeftSide + (100 * totalAbove));
}

class Block {
    constructor(rawLines) {
        this.rawLines = rawLines;
        this.horizontalLinesValues = this.getLineValues(this.rawLines);
        this.verticalLinesValues = this.getLineValues(rotateLines(this.rawLines));
        this.numberOfLeftSideLines = this.scanForMirroring(this.horizontalLinesValues);
        this.numberOfAboveLines = this.scanForMirroring(this.verticalLinesValues);  //not sure its that easy, is the rotation working correctly for this case?

    }
    getLineValues(rawLines) {
        let valueLines = [];
        for(const rawLine of rawLines) {
            let binaryValue = 2;
            for(const char of rawLine) {
                let lineValue = 0;  //put a level up?
                if (char === '#') { lineValue += binaryValue; }
                binaryValue *= 2;
            }
            valueLines.push(lineValue);
        }
        return valueLines;
    }
    scanForMirroring(lineValues) {
        for (let i = 0; i < lineValues.length; i++) {
            if (lineValues[i] === previousValue) {
                if (confirmMirroring(i - 0.5)) {
                    return i; //would be -1, but zero indexing
                }
            }
            let previousValue = value;
        }
        return 0;
    }
    confirmMirroring(lineValues, mirrorLocation) {
        let leftSideIndex = Math.floor(mirrorLocation);
        let rightSideIndex = Math.ceil(mirrorLocation);
        let i = 0;
        
        while(lineValues[leftSideIndex - i] !== -1 && lineValues[rightSideIndex + i] !== -1) {
            i++;
            if (lineValues[leftSideIndex - i] !== lineValues[rightSideIndex + i]) { return false; }
        }
        return true;
    }
}

function rotateLines(lines) {
    let rotatedLines = [];
    const lineLength = lines[0].length;
    
    for(let i = 0; i < lineLength; i++) {
        let rotatedLine = '';
        for(const line of lines) {
            rotatedLine += line[i];
        }
        rotatedLines.push(rotatedLine);
    }
    return rotatedLines;
}

main();