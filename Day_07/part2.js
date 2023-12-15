const fs = require('fs');
 
function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(solvePuzzle(extractLinesFromInputFile()));
}

function solvePuzzle(lines) {
    let hands = [];
    for(const line of lines) {
        let hand = line.split(' ');
        hands.push(new Hand(hand[0].split(''), parseInt(hand[1])));
    }
    return new SetOfHands(hands).totalWinnings;
}

function compareHands(a, b) {
    return compareHandsByType(a, b) || compareHandsByCards(a, b);
}

function compareHandsByType(a, b) {
    return a.type.value - b.type.value;
}

function compareHandsByCards(a, b) {
    for(let i = 0; i < a.cards.length; i++) {
        let result = a.cards[i].value - b.cards[i].value;
        if (result) { return result; }
    }
    return 0;
}

function compareCards(a, b) {
    return compareCardsByNumberOfAppearancesInHand(a, b) || compareCardsByValue(a, b);
}

function compareCardsByNumberOfAppearancesInHand(a, b) {
    return a.numberOfAppearancesInHand - b.numberOfAppearancesInHand;
}

function compareCardsByValue(a, b) {
    return a.value - b.value;
}

class SetOfHands {
    constructor(hands) {
        this.hands = hands;
        this.fillRanksForHands();
        this.fillValuesForHands();
        this.totalWinnings = this.hands.reduce((total, currentHand) => total + currentHand.value, 0);
    }
    fillRanksForHands() {
        this.hands.sort(compareHands);
        for(let i = 0; i < this.hands.length; i++) {
           this.hands[i].rank = i + 1;
        }
    }
    fillValuesForHands() {
        for(const hand of this.hands) {
            hand.value = hand.bid * hand.rank;
        }
    }
}

class Hand {
    constructor(cards, bid) {
        this.cards = [];
        for(let i = 0; i < cards.length; i++) {
            this.cards.push(new Card(cards[i], cards.filter((card) => card === cards[i]).length));
        }
        this.bid = bid;
        this.numberOfJokers = this.getNumberOfJokers();
        this.highestValueCard = this.getHighestValueCard();
        this.type = this.getType();
        this.rank = null;
        this.value = null;
    }
    getNumberOfJokers() {
        return this.cards.filter((card) => card.isJoker()).length;
    }
    getHighestValueCard() {
        let cards = this.cards.map(card => ({ ...card })); //make a better copy
        if (this.numberOfJokers === 5) { return cards[0]; }
        cards = cards.filter((card) => (card.inscription !== 'J')); //if I made a better copy I could use isJoker()
        return cards.sort(compareCards)[cards.length - 1];
    }
    useJokers() {
        this.cards.forEach((card) => {
            if (this.numberOfJokers === 5) { return; }
            if (card.isJoker()) { card.numberOfAppearancesInHand = this.highestValueCard.numberOfAppearancesInHand + this.numberOfJokers; }
            if (card.inscription === this.highestValueCard.inscription) { card.numberOfAppearancesInHand += this.numberOfJokers; }
        })
    }
    getType() {
        let score = 0;
        this.useJokers();
        for(const card of this.cards) {
            score += card.numberOfAppearancesInHand;
        }
        switch(score) {
            case(5): {
                return new Type('highCard', 1);
            }
            case(7): {
                return new Type('onePair', 2);
            }
            case(9): {
                return new Type('twoPair', 3);
            }
            case(11): {
                return new Type('threeOfKind', 4);
            }
            case(13): {
                return new Type('fullHouse', 5);
            }
            case(17): {
                return new Type('fourOfKind', 6);
            }
            case(25): {
                return new Type('fiveOfKind', 7);
            }
        }
    }
    calculateValue() {
        this.value = this.rank * this.bid;
    }
}

class Card {
    constructor(inscription, numberOfAppearancesInHand) {
        const valueMap = 'J23456789TQKA';
        this.inscription = inscription;
        this.value = valueMap.indexOf(inscription);
        this.numberOfAppearancesInHand = numberOfAppearancesInHand;
    }
    isJoker() {
        return (this.inscription === 'J');
    }
}
 
class Type {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

main();