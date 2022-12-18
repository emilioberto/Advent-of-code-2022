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

        let shouldStop = false;
        let leftScore = 0;
        while (!shouldStop) {
            leftScore--;
            if (j + leftScore < 0) {
                shouldStop = true;
                leftScore++;
                continue;
            }

            if (map[i][j - leftScore] >= elementToCheck) {
                shouldStop = true;
            }
        }
        if (leftScore < 0) {
            leftScore *= -1;
        }

        shouldStop = false;
        let rightScore = 0;
        while (!shouldStop) {
            rightScore++;
            if (j + rightScore >= map[0].length) {
                shouldStop = true;
                rightScore--;
                continue;
            }

            if (map[i][j + rightScore] >= elementToCheck) {
                shouldStop = true;
            }
        }

        const verticalRow: number[] = []
        for (let k = 0; k < map.length; k++) {
            verticalRow.push(map[k][j]);
        }

        shouldStop = false;
        let upperScore = 0;
        while (!shouldStop) {
            upperScore--;
            if (i + upperScore < 0) {
                shouldStop = true;
                upperScore++;
                continue;
            }

            if (verticalRow[i - upperScore] < elementToCheck) {
                shouldStop = true;
            }
        }
        if (upperScore < 0) {
            upperScore *= -1;
        }

        shouldStop = false;
        let lowerScore = 0;
        while (!shouldStop) {
            lowerScore++;
            if (i + lowerScore >= verticalRow.length) {
                shouldStop = true;
                lowerScore--;
                continue;
            }

            if (verticalRow[i + lowerScore] >= elementToCheck) {
                shouldStop = true;
            }
        }

        const totalScore = leftScore * rightScore * upperScore * lowerScore;
        if (totalScore > maxScore) {
            maxScore = totalScore;
        }
    }
}

console.log(maxScore);


// Utils
