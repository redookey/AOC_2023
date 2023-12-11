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

class PipeLoop {
    constructor(startingPipe, rows, startingPipeRowNumber) {
        this.startingPipe = startingPipe;

        this.currentForwardRow = this.rows[startingPipeRowNumber];
        this.currentBackwardRow = this.rows[startingPipeRowNumber];
        this.upperForwardRow = this.rows[startingPipeRowNumber - 1];
        this.upperBackwardRow = this.rows[startingPipeRowNumber - 1];
        this.lowerForwardRow = this.rows[startingPipeRowNumber + 1];
        this.lowerBackwardRow = this.rows[startingPipeRowNumber + 1];

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
        //i need to update the rpws after each extend (west,east->stay the same; north - go up; south - go down)
    }

    extendPipeMapForward(currentRow, upperRow, lowerRow) {
        this.nextForwardPipe = this.getNextPipe(this.lastFoundForwardPipe, currentRow, upperRow, lowerRow);
        this.pipes.push(this.lastFoundForwardPipe);
        this.lastFoundForwardPipe = this.nextForwardPipe;
        this.nextForwardPipe = null;
    }
    extendPipeMapBackward(currentRow, upperRow, lowerRow) {
        this.nextBackwardPipe = this.getNextPipe(this.lastFoundBackwardPipe, currentRow, upperRow, lowerRow);
        this.pipes.push(this.lastFoundBackwardPipe);
        this.lastFoundBackwardPipe = this.nextBackwardPipe;
        this.nextBackwardPipe = null;
    }
    
    getNextPipe(previousPipe, currentRow, upperRow, lowerRow) {
        let nextPipe = null;
        switch(previousPipe.nextCompatibility) {
            case ('north'): {
                nextPipe = new Pipe(upperRow[previousPipe.columnNumber],/* rowNumber ,*/ previousPipe.columnNumber, previousPipe.nextCompatibility);
                break;
            }
            case ('south'): {
                nextPipe = new Pipe(lowerRow[previousPipe.columnNumber],/* rowNumber ,*/ previousPipe.columnNumber, previousPipe.nextCompatibility);
                break;
            }
            case ('west'): {
                nextPipe = new Pipe(currentRow[previousPipe.columnNumber - 1],/* rowNumber ,*/ previousPipe.columnNumber - 1, previousPipe.nextCompatibility);
                break;
            }
            case ('east'): {
                nextPipe = new Pipe(currentRow[previousPipe.columnNumber + 1],/* rowNumber ,*/ previousPipe.columnNumber + 1, previousPipe.nextCompatibility);
                break;
            }
        }
        return nextPipe;
    }
}


class Pipe {
    constructor(symbol, /* rowNumber, */columnNumber, previousCompatibility, distanceFromStart) {
        this.type = new PipeType(symbol);
        //this.rowNumber = rowNumber; 
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