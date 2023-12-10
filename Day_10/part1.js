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
    constructor(startingPipe) {
        this.startingPipe = startingPipe;
        this.furtherestPipe = null;
        this.pipes = [];
        this.lastFoundPipe = startingPipe;
    }
    scanForNextPipe(currentRow, upperRow, lowerRow) {
        // this.lastFoundPipe.
    }

}


class Pipe {
    constructor(symbol, rowNumber, columnNumber, previousCompatibility, nextCompatibility) /*northSymbol, southSymbol, westSymbol, eastSymbol)*/ {
        this.type = new PipeType(symbol);
        this.rowNumber = rowNumber; 
        this.columnNumber = columnNumber;
        this.previousCompatibility = previousCompatibility;
        this.nextCompatibility = nextCompatibility;
        // this.northPipeType = new PipeType(northSymbol);
        // this.southPipeType = new PipeType(southSymbol);
        // this.westPipeType = new PipeType(westSymbol);
        // this.eastPipeType = new PipeType(eastSymbol);
        
        if (this.type.symbol === 'S') { this.initStartingPipe(); }
        // this.distanceFromStart
    }
    getNextCompatibility() {

    }
    // initStartingPipe() {
    //     this.isStartingPipe = true;
    //     if (this.northPipeType.southCompatible && this.southPipeType.northCompatible) {
    //         this.type.symbol = '|';
    //         this.type.northCompatible = true;
    //         this.type.southCompatible = true;
    //     }
    //     if (this.westPipeType.eastCompatible && this.eastPipeType.westCompatible) {
    //         this.type.symbol = '-';
    //         this.type.westCompatible = true;
    //         this.type.eastCompatible = true;
    //     }
    //     if (this.northPipeType.southCompatible && this.eastPipeType.westCompatible) {
    //         this.type.symbol = 'L';
    //         this.northCompatible = true;
    //         this.eastCompatible = true;
    //     }
    //     if (this.northPipeType.southCompatible && this.westPipeType.eastCompatible) {
    //         this.type.symbol = 'J';
    //         this.northCompatible = true;
    //         this.westCompatible = true;
    //     }
    //     if (this.southPipeType.northCompatible && this.westPipeType.eastCompatible) {
    //         this.type.symbol = '7';
    //         this.southCompatible = true;
    //         this.westCompatible = true;
    //     }
    //     if (this.southPipeType.northCompatible && this.eastPipeType.westCompatible) {
    //         this.type.symbol = 'F';
    //         this.southCompatible = true;
    //         this.eastCompatible = true;
    //     }
    // }
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
            // initCompatibility() {
                //     this.northCompatible = false;
                //     this.southCompatible = false;
    //     this.westCompatible = false;
    //     this.eastCompatible = false;

    //     switch(this.symbol) {
    //         case('S'): {
    //             break;
    //         }
    //         case('|'): {
    //             this.northCompatible = true;
    //             this.southCompatible = true;
    //             break;
    //         }
    //         case('-'): {
    //             this.westCompatible = true;
    //             this.eastCompatible = true;
    //             break;
    //         }
    //         case('L'): {
    //             this.northCompatible = true;
    //             this.eastCompatible = true;
    //             break;
    //         }
    //         case('J'): {
    //             this.northCompatible = true;
    //             this.westCompatible = true;
    //             break;
    //         }
    //         case('7'): {
    //             this.southCompatible = true;
    //             this.westCompatible = true;
    //             break;
    //         }
    //         case('F'): {
    //             this.southCompatible = true;
    //             this.eastCompatible = true;
    //             break;
    //         }
    //     }
    // }

class Location {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}