import readline from "readline";
import fs from "fs";

const figureScoresMap = new Map([
    ['A', 1],
    ['B', 2],
    ['C', 3],
    ['X', 1],
    ['Y', 2],
    ['Z', 3],
]);

const handResultMap = new Map([
    ['L', 0],
    ['D', 3],
    ['W', 6],
])

const myMapping = ['A', 'B', 'C'];
const opponentMapping = ['X', 'Y', 'Z'];

let input: string[][] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/2/input')
});

for await (const line of readInterface) {
    const [mine, _, opponent] = line;
    input.push([mine, opponent]);
}

// Part 1

let resultPart1 = 0;
input.forEach(([mine, opponent]) => {
    resultPart1 += figureScoresMap.get(mine);

    const handResult = getHandResult(mine, opponent);

    resultPart1 += handResultMap.get(handResult);
});

console.log(`Part 1 result is: ${resultPart1}`);

// Part 2

const opponentHandToExpectedResultMap = new Map([
    ['X', 'L'],
    ['Y', 'D'],
    ['Z', 'W']
]);

let resultPart2 = 0;
input.forEach(([opponentChoice, expectedResultKey]) => {
    const expectedResult = opponentHandToExpectedResultMap.get(expectedResultKey) as 'D' | 'W' | 'L';
    resultPart2 += handResultMap.get(expectedResult);

    const figureToSatisfyExpectedResult = getSatisfyingFigure(opponentChoice, expectedResult);
    resultPart2 += figureScoresMap.get(figureToSatisfyExpectedResult);
});

console.log(`Part 2 result is: ${resultPart2}`);

// Utils

function getHandResult(mine: string, opponent: string): 'D' | 'W' | 'L' {
    const myIndex = myMapping.indexOf(mine);
    const opponentIndex = opponentMapping.indexOf(opponent);
    if (myIndex === opponentIndex) {
        return 'D';
    }

    if ((myIndex + 1) % 3 === opponentIndex) {
        return 'L'
    }

    return 'W';
}

function getSatisfyingFigure(value: string, expectedResult: 'D' | 'W' | 'L'): 'X' | 'Y' | 'Z' {
    const index = myMapping.indexOf(value);
    if (expectedResult === 'D') {
        return opponentMapping[index] as 'X' | 'Y' | 'Z';
    }

    const module = (index + 1) % 3;
    if (expectedResult === 'W') {
        return opponentMapping[module] as 'X' | 'Y' | 'Z';
    }

    return opponentMapping.find((value, i) => i !== index && i !== module)  as 'X' | 'Y' | 'Z';
}
