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
    const startingPointPosition = data.indexOf('S');
    const startingPointLocation = new Location(startingPointPosition / rows[0].length, startingPointPosition % rows[0].length);
    
    const rows = data.split(/\r?\n/);
    const gameField = new GameField(rows, startingPointLocation);
    
    
}

class GameField {
    constructor(rows, startingPointLocation) {
        this.rows = rows;
        this.startingPointLocation = startingPointLocation;

        //this.startingPipe = new Pipe(rows[startingPointLocation.row][startingPointLocation.column], )
    }
    scanForNextPipe() {

    }
}

class RowSet {
    constructor(allRows, currentRowNumber) {
        this.allRows = allRows;
        this.updateRowSet(currentRowNumber);
    }
    updateRowSet(currentRowNumber) {
        currentRow = new Row(rows[currentRowNumber], currentRowNumber);
        upperRow = new Row(rows[currentRowNumber - 1], currentRowNumber - 1);
        lowerRow = new Row(rows[currentRowNumber + 1], currentRowNumber + 1);
    }
}

class Row {
    constructor(values, number) {
        this.values = values;
        this.number = number;
    }

}

class PipeLoop {
    constructor(startingPipe, rows, startingPipeRowNumber) {
        this.startingPipe = startingPipe;
        this.rows = rows;

        this.forwardRowSet = new RowSet(rows, startingPipeRowNumber);
        this.backwardRowSet = new RowSet(rows, startingPipeRowNumber);

        this.lastFoundForwardPipe = startingPipe;
        this.lastFoundBackwardPipe = startingPipe;

        this.pipes = [];
        // this.furtherestPipe = null;
    }
    extendPipeMap() {
        //basically what I did in Day9 ->
        //each call,this function will push a newly found pipe to the end of the array (in direction1),
        //and unshift a newly found pipe at the beginning of the array (direction2) ->
        //until both of them reach the startingPipe (the loop will be fully mapped then) ->
        //afterwards I can simply take the index of the startingPipe in the array and there we go
        this.extendPipeMapForward();
        this.extendPipeMapBackward();
        //i need to update the rows after each extend (west,east->stay the same; north - go up; south - go down)
    }
    
    extendPipeMapForward() {
        //[0]maybe make a general function for these two functions?
        const nextPipe = this.getNextPipe(this.lastFoundForwardPipe, this.forwardRowSet);
        if (nextPipe) { this.nextForwardPipe = nextPipe; }
        else { /*S reached*/ }
        this.forwardRowSet.updateRowSet(this.nextForwardPipe.rowNumber);
        this.pipes.push(this.lastFoundForwardPipe);
        this.lastFoundForwardPipe = this.nextForwardPipe;
        this.nextForwardPipe = null;
    }
    extendPipeMapBackward() {
        //[0]
        const nextPipe = this.getNextPipe(this.lastFoundBackwardPipe, this.backwardRowSet);
        if (nextPipe) { this.nextBackwardPipe = nextPipe; }
        else { /*S reached*/ }
        this.backwardRowSet.updateRowSet(this.nextBackwardPipe.rowNumber);
        this.pipes.push(this.lastFoundBackwardPipe);
        this.lastFoundBackwardPipe = this.nextBackwardPipe;
        this.nextBackwardPipe = null;
    }
    
    getNextPipe(previousPipe, rowSet) {
        let nextPipe = null;
        switch(previousPipe.nextCompatibility) {
            case ('north'): {
                nextPipe = new Pipe(rowSet.upperRow.values[previousPipe.columnNumber], rowSet.upperRow.number , previousPipe.columnNumber, previousPipe.nextCompatibility);
                break;
            }
            case ('south'): {
                nextPipe = new Pipe(rowSet.lowerRow.values[previousPipe.columnNumber], rowSet.lowerRow.number , previousPipe.columnNumber, previousPipe.nextCompatibility);
                break;
            }
            case ('west'): {
                nextPipe = new Pipe(rowSet.currentRow.values[previousPipe.columnNumber - 1], rowSet.currentRow.number , previousPipe.columnNumber - 1, previousPipe.nextCompatibility);
                break;
            }
            case ('east'): {
                nextPipe = new Pipe(rowSet.currentRow.values[previousPipe.columnNumber + 1], rowSet.currentRow.number, previousPipe.columnNumber + 1, previousPipe.nextCompatibility);
                break;
            }
        }
        if (nextPipe.symbol === 'S') { return null; }
        return nextPipe;
    }
}


class Pipe {
    constructor(symbol, rowNumber, columnNumber, previousCompatibility, distanceFromStart) {
        this.type = new PipeType(symbol);
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.previousCompatibility = previousCompatibility;
        this.nextCompatibility = getNextCompatibility();
        
        if (this.type.symbol === 'S') { this.initStartingPipe(); }
        this.distanceFromStart = distanceFromStart;
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
        this.initCompatibility();
    }
    initCompatibility() {
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
      
class Location {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}