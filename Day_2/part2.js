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
    for(const line of inputLines) { result += getGameScore(line); }
    return result;
}

function getGameScore(game) {
    const sets = game.slice(game.indexOf(':') + 2).split('; '); //[0]upgradeReadability: instead of using ["; " or + 2] use [';' and + 1](and use .trim instead)
    let allZero = true;
    let powerOfColors = 1;
    let minRgb = { r: 0, g: 0, b: 0 };

    for(const set of sets) {   
        let currentRgb = getRbgValue(set);
        minRgb = getLowestValues(minRgb, currentRgb);
    }
    for(const color in minRgb) {
        if (minRgb[color]) {
            powerOfColors *= minRgb[color];
            if (allZero) { allZero = false; } //optimalization: is it better than just setting allZero to false every time?
        }
    }
    if (allZero) { powerOfColors = 0; }
    return powerOfColors;
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

function getLowestValues(minRgb, currentRgb) {
    for(const color in currentRgb) {
        if (currentRgb[color] > minRgb[color]) {minRgb[color] = currentRgb[color]; }
    }
    return minRgb;
}

function digitFilter(str) {
    let digits = '';
    for(const char of str) {
        if(isDigit(char)) { digits = digits.concat(char); }
    }
    return parseInt(digits);
}

function isDigit(char) {
    const digits = '0123456789';
    return (digits.indexOf(char) !== -1);
}

main();