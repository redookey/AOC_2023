const fs = require('fs');

function extractDataFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data;
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractDataFromInputFile()));
    const end = Date.now();
    console.log(`start: ${start}\nend: ${end}`);
}

function solvePuzzle(data) {
    const dataWithoutSeperators = data.replaceAll(`\n`, '');
    const startingPointPosition = dataWithoutSeperators.indexOf('S');
    const rows = data.split(`\n`);
    const rowLength = rows[0].length;
    const startingPointLocation = new Location(Math.floor(startingPointPosition / rowLength), startingPointPosition % rowLength);

    return new PipeLoop(rows, startingPointLocation).getFurtherestDistanceFromStart();
}
class Location {
    constructor(rowNumber, columnNumber) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
    }
}

class PipeLoop {
    constructor(rows, startingPointLocation) {
        this.rows = rows;
        this.startingPointLocation = startingPointLocation;
        this.initStartingProperties();
        this.mapPipeLoop();
    }
    
    initStartingProperties() {
        this.startingRowSet = new RowSet(this.rows, this.startingPointLocation.rowNumber);
        this.startingPipe = new Pipe(this.rows[this.startingPointLocation.rowNumber][this.startingPointLocation.columnNumber], this.startingPointLocation.rowNumber, this.startingPointLocation.columnNumber, this.getStartingCompatibility());
    }

    getStartingCompatibility() {
        switch(true) {
            case(new PipeType(this.startingRowSet.upperRow.values[this.startingPointLocation.columnNumber]).compatibilities.includes('south')): {
                return 'north';
            }    
            case(new PipeType(this.startingRowSet.lowerRow.values[this.startingPointLocation.columnNumber]).compatibilities.includes('north')): {
                return 'south';
            }
            case(new PipeType(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber - 1]).compatibilities.includes('east')): {
                return 'west';
            }
            case(new PipeType(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber + 1]).compatibilities.includes('west')): {
                return 'east';
            }
        }
    }

    mapPipeLoop() {
        this.pipes = [this.startingPipe];
        this.lastFoundPipe = this.getNextPipe(this.startingPipe, this.startingRowSet);
        this.lastFoundRowSet = new RowSet(rows, this.lastFoundPipe.rowNumber);
        while(this.extendPipeMap()); //if this works, thats pretty cool
    }
    
    extendPipeMap() {
        const nextPipe = this.getNextPipe(this.lastFoundPipe, this.lastFoundRowSet);
        if (!nextPipe) { return false; }
        this.pipes.push(this.lastFoundPipe);
        this.lastFoundRowSet.updateRowSet(nextPipe.rowNumber);
        this.lastFoundPipe = nextPipe;
        return true;
    }
    
    getNextPipe(previousPipe, previousRowSet) {
        let nextPipe = null;
        switch(previousPipe.nextCompatibility) {
            case ('north'): {
                nextPipe = new Pipe(previousRowSet.upperRow.values[previousPipe.columnNumber], previousRowSet.upperRow.number , previousPipe.columnNumber, 'south');
                break;
            }
            case ('south'): {
                nextPipe = new Pipe(previousRowSet.lowerRow.values[previousPipe.columnNumber], previousRowSet.lowerRow.number , previousPipe.columnNumber, 'north');
                break;
            }
            case ('west'): {
                nextPipe = new Pipe(previousRowSet.currentRow.values[previousPipe.columnNumber - 1], previousRowSet.currentRow.number , previousPipe.columnNumber - 1, 'east');
                break;
            }
            case ('east'): {
                nextPipe = new Pipe(previousRowSet.currentRow.values[previousPipe.columnNumber + 1], previousRowSet.currentRow.number, previousPipe.columnNumber + 1, 'west');
                break;
            }
        }
        if (nextPipe.type.symbol === 'S') { return null; }
        return nextPipe;
    }

    getFurtherestDistanceFromStart() {
        return this.pipes.length / 2;
    }
}


class RowSet {
    constructor(allRows, currentRowNumber) {
        this.allRows = allRows;
        this.updateRowSet(currentRowNumber);
    }
    updateRowSet(currentRowNumber) {
        this.currentRow = new Row(this.allRows[currentRowNumber], currentRowNumber);
        this.upperRow = new Row(this.allRows[currentRowNumber - 1], currentRowNumber - 1);
        this.lowerRow = new Row(this.allRows[currentRowNumber + 1], currentRowNumber + 1);
    }
}

class Row {
    constructor(values, number) {
        this.values = values;
        this.number = number;
    }
}

class Pipe {
    constructor(symbol, rowNumber, columnNumber, previousCompatibility) {
        this.type = new PipeType(symbol);
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.previousCompatibility = previousCompatibility;
        this.nextCompatibility = getNextCompatibility();
    }
    getNextCompatibility() {
        for(const compatibility of this.type.compatibilities) {
            if (compatibility !== this.previousCompatibility) { return compatibility; }
        }
    }
}

class PipeType {
    constructor(symbol) {
        this.symbol = symbol;
        this.initCompatibilities();
    }
    initCompatibilities() {
        this.compatibilities = [];
        switch(this.symbol) {
            case('S'): {
                break;
            }
            case('|'): {
                this.compatibilities.push('north', 'south');
                break;
            }
            case('-'): {
                this.compatibilities.push('west', 'east');
                break;
            }
            case('L'): {
                this.compatibilities.push('north', 'east');
                break;
            }
            case('J'): {
                this.compatibilities.push('north', 'west');
                break;
            }
            case('7'): {
                this.compatibilities.push('south', 'west');
                break;
            }
            case('F'): {
                this.compatibilities.push('south', 'east')
                break;
            }
        }
    }
}

main();