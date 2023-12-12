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
    const constructedMap = new PipeLoop(rows, startingPointLocation).getConstructedMap();

}

function x(constructedMap) {
    //constructedMap[] //change first symbol to '0'
    for(const mapLine of constructedMap) {
        for(const symbol of mapLine) {
            if (symbol !== '.') { continue; }
            scanFor
        }
    }
}

// class Dot {
//     constructor(groupId, rowNumber, columnNumber, rowSet) {
//         this.groupId = groupId;
//         this.rowNumber = rowNumber;
//         this.columnNumber = columnNumber;
//         this.rowSet = rowSet;
//     }
//     isInfected() {

//     }
    
// }

// class DotGroup {
//     constructor(id, isInfected) {
//         this.id = id;
//         this.isInfected = isInfected;
//     }
// }

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
        this.startingCompatibilities = this.getStartingCompatibilities();
        this.startingPipe = new Pipe(this.rows[this.startingPointLocation.rowNumber][this.startingPointLocation.columnNumber], this.startingPointLocation.rowNumber, this.startingPointLocation.columnNumber, this.startingCompatibilities[0], this.startingCompatibilities[1]);
    }

    getStartingCompatibilities() {
        let compatibilities = [];
        if (new PipeType(this.startingRowSet.upperRow.values[this.startingPointLocation.columnNumber]).compatibilities.includes('south')) { compatibilities.push('north'); }    
        if (new PipeType(this.startingRowSet.lowerRow.values[this.startingPointLocation.columnNumber]).compatibilities.includes('north')) { compatibilities.push('south'); }
        if (new PipeType(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber - 1]).compatibilities.includes('east')) { compatibilities.push('west'); }
        if (new PipeType(this.startingRowSet.currentRow.values[this.startingPointLocation.columnNumber + 1]).compatibilities.includes('west')) { compatibilities.push('east'); }
        return compatibilities;
    }

    mapPipeLoop() {
        this.pipes = [this.startingPipe];
        this.lastFoundPipe = this.getNextPipe(this.startingPipe, this.startingRowSet);
        this.lastFoundRowSet = new RowSet(this.rows, this.lastFoundPipe.rowNumber);
        while(this.extendPipeMap());
    }
    
    extendPipeMap() {
        const nextPipe = this.getNextPipe(this.lastFoundPipe, this.lastFoundRowSet);
        this.pipes.push(this.lastFoundPipe);
        if (!nextPipe) { return false; }
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

    getRawMap() {
        let rawMap = this.rows.join('');
        let newSymbol = '#';
        rawMap = rawMap.replaceAll('|', 'I');
        rawMap = rawMap.replaceAll('-', '_');
        for(const pipe of this.pipes) {
            switch(pipe.type.symbol) {
                case('|'): {
                    newSymbol = '|';
                    break;
                }
                case('-'): {
                    newSymbol = '-';
                    break;
                }
                case('L'): {
                    newSymbol = '└';
                    break;
                }
                case('J'): {
                    newSymbol = '┘';
                    break;
                }
                case('7'): {
                    newSymbol = '┐';
                    break;
                }
                case('F'): {
                    newSymbol = '┌';
                    break;
                }
            }
            rawMap = rawMap.substring(0, pipe.rawDataPosition) + newSymbol + rawMap.substring(pipe.rawDataPosition + 1);
        }
        
        const validCharacters = "#|-└┘┐┌";

        rawMap = rawMap.split('');
        for (let i = 0; i < rawMap.length; i++) {
            if (!validCharacters.includes(rawMap[i])) { rawMap[i] = '.'; }
        }
        rawMap = rawMap.join('');

        return rawMap;
    }
    
    getConstructedMap() {
        const rawMap = this.getRawMap();
        const constructedMap = [];
        const rowLength = this.rows[0].length;
        for (let i = 0; i < rawMap.length; i += rowLength) {
            constructedMap.push(rawMap.substring(i, i + rowLength));
        }
        return constructedMap.join(`\n`);
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
    constructor(symbol, rowNumber, columnNumber, previousCompatibility, nextCompatibility = null) {
        this.type = new PipeType(symbol);
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.rawDataPosition = this.getRawDataPosition();
        this.previousCompatibility = previousCompatibility;
        if (nextCompatibility) { this.nextCompatibility = nextCompatibility; }
        else { this.nextCompatibility = this.getNextCompatibility(); }
    }
    getRawDataPosition() {
        return this.rowNumber * 140 + this.columnNumber;
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