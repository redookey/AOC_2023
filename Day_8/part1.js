const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    console.log(solvePuzzle(extractLinesFromInputFile()));
}

function solvePuzzle(lines) {
    const instructions = lines.shift();
    const nodes = new NodeSet(getNodes(lines));
    nodes.setCurrentNode('AAA');
    while(true) {
        for(const instruction of instructions) {
            if(nodes.currentNode.code === 'ZZZ') { return nodes.numberOfSteps; }
            if(instruction === 'L') { nodes.setCurrentNode(nodes.currentNode.leftNodeCode); }
            if(instruction === 'R') { nodes.setCurrentNode(nodes.currentNode.rightNodeCode); }
            nodes.incrementNumberOfSteps();
        }
    }
}

function getNodes(lines) {
    let nodes = [];
    for(const line of lines) {
        let coordinates = line.replace(/[^A-Z]/g, '');
        if (line) {
            nodes.push(new Node(coordinates.substring(0, 3), coordinates.substring(3, 6), coordinates.substring(6, 9)));
        }
    }
    return nodes;
}

class NodeSet {
    constructor(nodes) {
        this.nodes = nodes;
        this.numberOfSteps = 0;
    }
    setCurrentNode(nodeCode) {
        this.currentNode = this.nodes.find((node) => node.code === nodeCode);
    }
    incrementNumberOfSteps() {
        this.numberOfSteps++;
    }
}

class Node {
    constructor(code, leftNodeCode, rightNodeCode) {
        this.code = code;
        this.leftNodeCode = leftNodeCode;
        this.rightNodeCode = rightNodeCode;
    } 
}

main();