import fs from "fs";
import readline from "readline";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/8/input')
});

for await (const line of readInterface) {
    input.push(line);
}

const map: number[][] = [];
input.forEach(row => {
    map.push(row.split('').map(e => +e));
})

// Part 1

let visibleTrees = (map.length * 2) + (map[0].length * 2) - 4;

for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[0].length - 1; j++) {
        const elementToCheck = map[i][j];

        const leftCheck = map[i]
            .filter((value, index) => index < j)
            .every((value, index) => {
                return value < elementToCheck;
            });
        const rightCheck = map[i]
            .filter((value, index) => index > j)
            .every((value, index) => {
                return value < elementToCheck;
            });

        const verticalRow: number[] = []
        for (let k = 0; k < map.length; k++) {
            verticalRow.push(map[k][j]);
        }

        const upperCheck = verticalRow
            .filter((value, index) => {
                return index < i
            })
            .every((value, index, array) => {
                return value < elementToCheck;
            });
        const lowerCheck = verticalRow
            .filter((value, index) => {
                return index > i
            })
            .every((value, index, array) => {
                return value < elementToCheck;
            });

        if (leftCheck || rightCheck || lowerCheck || upperCheck) {
            visibleTrees++;
        }
    }
}

console.log(visibleTrees);

// Part 2

let maxScore = 0;
for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[0].length - 1; j++) {
        const elementToCheck = map[i][j];

        const leftScore = checkLeft(elementToCheck, j, map[i]);
        const rightScore = checkRight(elementToCheck, j, map[i]);

        const verticalRow: number[] = []
        for (let k = 0; k < map.length; k++) {
            verticalRow.push(map[k][j]);
        }

        const upperScore = checkLeft(elementToCheck, i, verticalRow);
        const lowerScore = checkRight(elementToCheck, i, verticalRow);

        const totalScore = upperScore * leftScore * lowerScore * rightScore;
        if (totalScore > maxScore) {
            maxScore = totalScore;
        }
    }
}

console.log(maxScore);


// Utils


function checkLeft(valueToCheck: number, startingIndex: number, array: number[]): number {
    let shouldStop = false;
    let leftScore = 0;
    while (!shouldStop) {
        leftScore++;
        if (startingIndex - leftScore === 0) {
            shouldStop = true;
            continue;
        }

        if (array[startingIndex - leftScore] >= valueToCheck) {
            shouldStop = true;
        }
    }

    return leftScore;
}

function checkRight(valueToCheck: number, startingIndex: number, array: number[]): number {
    let shouldStop = false;
    let rightScore = 0;
    while (!shouldStop) {
        rightScore++;
        if (startingIndex + rightScore === array.length - 1) {
            shouldStop = true;
            continue;
        }

        if (array[startingIndex + rightScore] >= valueToCheck) {
            shouldStop = true;
        }
    }

    return rightScore;
}
