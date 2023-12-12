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
    const pipeLoop = new PipeLoop(rows, startingPointLocation);
    
    
}

class PipeLoop {
    constructor(rows, startingPointLocation) {
        this.rows = rows;
        this.startingPointLocation = startingPointLocation;
        this.startingPipe = new StartingPipe(rows[startingPointLocation.rowNumber][startingPointLocation.columnNumber], startingPointLocation.rowNumber, startingPointLocation.columnNumber, null);
        this.startingRowSet = new RowSet(rows, startingPointLocation.rowNumber);
        this.lastFoundPipe = this.getSecondPipe();
        this.lastFoundRowSet = ; //TODO
        //its stupid to go both ways, just go forward
//maybe get rid of the whole startingPipe thing? just use htose seprete pieces of information to initialize first pipes of each direction
//gotta take care of the array logic (maybe don include startingPipe and divide by 2 at the end? floor up?)
        
        this.pipes = [this.startingPipe];
        this.mapPipeLoop();
        this.furtherestPipeNumber = this.pipes.indexOf(startingPipe); //i dont think this will work
    }
    getSecondPipe() {
        switch(true) {
            case(new PipeType(this.startingRowSet.upperRow.values[this.startingPointLocation.columnNumber]).compatibilities.includes('south')): {
                return new Pipe(this.startingRowSet.upperRow.values[this.startingPointLocation.columnNumber], this.startingPointLocation.rowNumber - 1, this.startingPointLocation.columnNumber, 'south');
            }
            case(new PipeType(this.startingRowSet.lowerRow.values[this.startingPointLocation.columnNumber]).compatibilities.includes('north')): {
                return new Pipe(this.startingRowSet.lowerRow.values[this.startingPointLocation.columnNumber], this.startingPointLocation.rowNumber + 1, this.startingPointLocation.columnNumber, 'north');
            }
            case(new PipeType(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber - 1]).compatibilities.includes('east')): {
                return new Pipe(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber - 1], this.startingPointLocation.rowNumber, this.startingPointLocation.columnNumber - 1, 'east');
            }
            case(new PipeType(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber + 1]).compatibilities.includes('west')): {
                return new Pipe(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber + 1], this.startingPointLocation.rowNumber, this.startingPointLocation.columnNumber + 1, 'west');
            }
        }
    }
    mapPipeLoop() {
        while(this.extendPipeMap());
    }
    extendPipeMap() {
        //basically what I did in Day9 ->
        //each call,this function will push a newly found pipe to the end of the array (in direction1),
        //and unshift a newly found pipe at the beginning of the array (direction2) ->
        //until both of them reach the startingPipe (the loop will be fully mapped then) ->
        //afterwards I can simply take the index of the startingPipe in the array and there we go
        if (!this.extendPipeMapForward()) { return false; }
        if (!this.extendPipeMapBackward()) { return false; }
        return true;
        //i need to update the rows after each extend (west,east->stay the same; north - go up; south - go down)
    }
    
    extendPipeMapForward() {
        //[0]maybe make a general function for these two functions?
        const nextPipe = this.getNextPipe(this.lastFoundForwardPipe, this.forwardRowSet);
        if (!nextPipe) { return false; }
        this.nextForwardPipe = nextPipe;
        this.forwardRowSet.updateRowSet(this.nextForwardPipe.rowNumber);
        this.pipes.push(this.lastFoundForwardPipe);
        this.lastFoundForwardPipe = this.nextForwardPipe;
        this.nextForwardPipe = null;
        return true;
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

class Location {
    constructor(rowNumber, columnNumber) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
    }
}

class RowSet {
    constructor(allRows, currentRowNumber) {
        this.allRows = allRows;
        this.updateRowSet(currentRowNumber);
    }
    updateRowSet(currentRowNumber) {
        this.currentRow = new Row(rows[currentRowNumber], currentRowNumber);
        this.upperRow = new Row(rows[currentRowNumber - 1], currentRowNumber - 1);
        this.lowerRow = new Row(rows[currentRowNumber + 1], currentRowNumber + 1);
    }
}

class Row {
    constructor(values, number) {
        this.values = values;
        this.number = number;
    }
}

class Pipe {
    constructor(symbol, rowNumber, columnNumber, previousCompatibility/*, distanceFromStart*/) {
        this.type = new PipeType(symbol);
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.previousCompatibility = previousCompatibility;
        this.nextCompatibility = getNextCompatibility();
        
        if (this.type.symbol === 'S') { this.initStartingPipe(); }
        // this.distanceFromStart = distanceFromStart;
    }
    getNextCompatibility() {
        for(const compatibility of this.type.compatibilities) {
            if (compatibility !== this.previousCompatibility) { return compatibility; }
        }
    }
}

class StartingPipe extends Pipe {
    constructor(symbol, rowNumber, columnNumber, compatibilities) {
        super(symbol, rowNumber, columnNumber, null);
        this.compatibilities = compatibilities;
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