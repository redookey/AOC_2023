const fs = require('fs');

function main() {
    console.log(guessTheSum(extractLinesFromInputFile()));
}

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function guessTheSum(inputLines) {
    let result = 0;
    let gameNo = 0; 
    for(const line of inputLines) {
        gameNo++;
        if (isGameValid(line)) { result += gameNo; };
    }
    return result;
}

function isGameValid(game) {
    const sets = game.slice(game.indexOf(':') + 2).split('; '); //[0]
    for(const set of sets) {   
        let rgb = getRbgValue(set);
        if (!combinationIsPossible(rgb)) { return false; }
    }
    return true;
}

function getRbgValue(set) {
    let draws = set.split(', ');
    let rgb = { r: 0, g: 0, b: 0 };

    for(const draw of draws) {
        switch(true) {
            case (draw.indexOf('red') !== -1): {
                rgb.r = digitFilter(draw);
                break;
            }
            case (draw.indexOf('green') !== -1): {
                rgb.g = digitFilter(draw);
                break;
            }
            case (draw.indexOf('blue') !== -1): {
                rgb.b = digitFilter(draw);
                break;
            }
        }
    }
    return rgb;
}

function combinationIsPossible(rgb) {
    const maxRgb = { r: 12, g: 13, b: 14 };

    for(const color in rgb) {
        if (rgb[color] > maxRgb[color]) { return false; }
    }
    return true;
}

function digitFilter(str) {
    let digits = '';
    for(const char of str) {
        if(isDigit(char)) {
            digits = digits.concat(char);
        }
    }
    return parseInt(digits);
}

function isDigit(char) {
    //return char >= '0' && char <= '9';
    const digits = '0123456789';
    for(const digit of digits) {
        if(char == digit) {
            return true;
        } 
    }
    return false;
}

main();