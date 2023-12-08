const fs = require('fs');

function extractLinesFromInputFile() {
    const data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
    return data.split(/\r?\n/);
}

function main() {
    const start = Date.now();
    console.log(solvePuzzle(extractLinesFromInputFile()));
    const end = Date.now();
    console.log(`start: ${start}\nend: ${end}`);
}

function solvePuzzle(lines) {
    const instructions = lines.shift();
    const nodeSet = new NodeSet(getNodes(lines));
    while(true) {
        for(const instruction of instructions) {
            if(nodeSet.allPathsFound()) { return nodeSet.getNumberOfSteps(); }
            for(let i = 0; i < nodeSet.currentNodes.length; i++) {
                if (nodeSet.starterNodes[i].pathFound) { continue; }
                if (instruction === 'L') { nodeSet.updatePath(nodeSet.currentNodes[i].leftNodeCode, i); }
                if (instruction === 'R') { nodeSet.updatePath(nodeSet.currentNodes[i].rightNodeCode, i); }
            }
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

function getLCM(numbers) {
    let result = 1;
    for (let i = 0; i < numbers.length; i++) {
        result = lcm(result, numbers[i]);
    }
    return result;
}

function lcm(number1, number2) {
    return number1 * number2 / gcd(number1, number2);
}

function gcd(number1, number2) {
    let result = 1;
    for (let i = 1; ((i <= number1) && (i <= number2)); i++) {
        if((number1 % i == 0) && (number2 % i == 0)) { result = i; }
    }
    return result;
}

class NodeSet {
    constructor(nodes) {
        this.nodes = nodes;
        this.starterNodes = this.nodes.filter(node => node.code[2] === 'A');
        this.currentNodes = this.starterNodes.map(node => ({ ...node }));
    }
    getNode(nodeCode) {
        return this.nodes.find(node => node.code === nodeCode);
    }
    updatePath(nextNodeCode, nodePosition) {
        this.currentNodes[nodePosition] = this.getNode(nextNodeCode);
        this.starterNodes[nodePosition].incrementNumberOfSteps();
        if (this.currentNodes[nodePosition].code[2] === 'Z') { this.starterNodes[nodePosition].pathFound = true; }
    }
    allPathsFound() {
        return this.starterNodes.every(node => node.pathFound);
    }
    getNumberOfSteps() {
        return getLCM(this.starterNodes.map(node => node.stepsToFinish));
    }
}

class Node {
    constructor(code, leftNodeCode, rightNodeCode) {
        this.code = code;
        this.leftNodeCode = leftNodeCode;
        this.rightNodeCode = rightNodeCode;
        this.pathFound = false;
        this.stepsToFinish = 0;
    } 
    incrementNumberOfSteps() {
        this.stepsToFinish++;
    }
}

main();