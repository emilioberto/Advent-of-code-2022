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
           return value < elementToCheck ;
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

debugger;
// Part 2

// Utils
