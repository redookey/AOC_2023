const fs = require('fs');

function main() {
    console.log(sortThisElfMessOut(extractLinesFromInputFile()));
}

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function sortThisElfMessOut(calibrationData) {
    let result = 0;
    for(const line of calibrationData) {
        result += calculateLine(line);
    }
    return result;
}

function calculateLine(calibrationLine) {
    const digitsInLine = digitFilter(calibrationLine);
    return parseInt(digitsInLine.charAt(0) + digitsInLine.charAt(digitsInLine.length - 1));
}

function digitFilter(str) {
    let digits = '';
    str = formatNumbers(str);
    
    for(const char of str) {
        if(isDigit(char)) {
            digits = digits.concat(char);
        }
    }
    return digits;
}


//prasarna -> ale funguje. uprav si to
//celkem se mi libi idea najit prvni cislo zepredu, pak najit prvni cislo odzadu - tam prestat, bude to cleaner a zaroven min narocny -> ./part2_v2.js 
function formatNumbers(str) {
    const spelledOutDigits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    let slicedStr = str;
    let loopCounter = 0;
    let checkpoint = -1;
    let resetStrLoop = false;
    let breakMainLoop = false;

    while(!breakMainLoop) {
        loopCounter = 0;
        resetStrLoop = false;
//optimalization idea: make a function that determines if there is something more to format, if not, dont go through the loop
        for(const char of str) {
            loopCounter++;
            if (loopCounter <= checkpoint) { continue; }
            slicedStr = str.slice(loopCounter - 1);
            for(const number of spelledOutDigits) {
                if(slicedStr.indexOf(number) === 0) {
                    // str = str.replace(number, (spelledOutDigits.indexOf(number) + 1).toString());
                    str = str.slice(0, loopCounter - 1) + (spelledOutDigits.indexOf(number) + 1).toString() + str.slice(loopCounter - 1);
                    checkpoint = loopCounter + 1;
                    resetStrLoop = true;
                    break;
                }
            }
            if (resetStrLoop) { break; }
            if(loopCounter === str.length) { breakMainLoop = true; }
        }
    }
    return str;
}

function isDigit(char) {
    const digits = '0123456789';
    return (digits.indexOf(char) !== -1);
}

main();