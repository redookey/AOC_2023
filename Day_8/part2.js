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
    const nodeSet = new NodeSet(getNodes(lines));
    while(true) {
        for(const instruction of instructions) {
            if(nodeSet.allCurrentNodesInFinish()) { return nodeSet.numberOfSteps; }
            for(let i = 0; i < nodeSet.currentNodes.length; i++) {
                if(instruction === 'L') { nodeSet.currentNodes[i] = nodeSet.getNode(nodeSet.currentNodes[i].leftNodeCode); }
                if(instruction === 'R') { nodeSet.currentNodes[i] = nodeSet.getNode(nodeSet.currentNodes[i].rightNodeCode); }
            }
            nodeSet.incrementNumberOfSteps();
        }
    }
}

function getNodes(lines) {
    let nodes = [];
    for(const line of lines) {
        let coordinates = line.replace(/[^A-Z0-9]/g, '');
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
        this.currentNodes = this.nodes.filter((node) => node.code[2] === 'A' );
    }
    allCurrentNodesInFinish() {
        return this.currentNodes.every((node) => (node.code[2] === 'Z'));
    }
    getNode(nodeCode) {
        return this.nodes.find((node) => node.code === nodeCode);
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

const start = Date.now();
main();
const end = Date.now();

console.log(`start: ${start}\nend:${end}`);