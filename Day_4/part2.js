const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(getScratchcardsAmount(extractLinesFromInputFile()));
}

function getScratchcardsAmount(lines) {
    let cards = fillCardDeck(lines);
    let scratchcardsAmount = 0;
    
    for (const card of cards) {
        calculateCardMatches(card);
        for(let i = card.noOfCopies; i >= 0; i--) {
            for(let i = card.matches; i > 0; i--) {
                cards.find(c => c.id === card.id + i).noOfCopies++;
            }
        }
        scratchcardsAmount += card.noOfCopies + 1;
    }
    return scratchcardsAmount;
}

function fillCardDeck(lines) {
    let cards = [];
    for(const line of lines) {
        const numberGroups = line.slice(line.indexOf(':') + 1).split('|');
        let card = {
            id: parseInt(line.slice(line.indexOf(' ') + 1, line.indexOf(':'))),
            winningNumbers: numberGroups[0].trim().split(' ').filter((word) => word != ''),
            myNumbers: numberGroups[1].trim().split(' ').filter((word) => word != ''),
            matches: 0,
            noOfCopies: 0
        };
        cards.push(card);
    }
    return cards;
}

function calculateCardMatches(card) {
    for(const number of card.myNumbers) {
        if (card.winningNumbers.includes(number)) { card.matches++; }
    }
}

main();