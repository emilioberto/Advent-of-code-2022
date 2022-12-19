import fs from "fs";
import readline from "readline";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/9/input')
});

for await (const line of readInterface) {
    input.push(line);
}

const instructions: [string, number][] = [];
input.forEach(row => {
    const [direction, steps] = row.split(' ');
    instructions.push([direction, +steps]);
})

// Part 1

const size = 1_000_000;
// let matrix = [];
// const row = Array(size).fill(null);
// for (let i = 0; i < size; i++) {
//     matrix.push([...row]);
// }
// matrix[size - 1][0] = 'H';

let headCurrentY = size - 1;
let headCurrentX = 0;

let tailCurrentY = size - 1;
let tailCurrentX = 0;

let lastDirection: string | null;
let visitedByTail: string[] = [];

for (const instruction of instructions) {
    const [direction, steps] = instruction;
    for (let i = 0; i < steps; i++) {
        // matrix[headCurrentY][headCurrentX] = '.';
        switch (direction) {
            case 'U':
                headCurrentY -= 1;
                break;
            case 'L':
                headCurrentX -= 1;
                break;
            case 'D':
                headCurrentY += 1;
                break;
            case 'R':
                headCurrentX += 1;
                break;
        }
        // matrix[headCurrentY][headCurrentX] = 'H';

        // 2 consecutive moves in same direction
        if (!lastDirection || lastDirection === direction) {
            // matrix[tailCurrentY][tailCurrentX] = '.';
            switch (direction) {
                case 'U':
                    // if on same axis AND detached then move
                    if (isDetached(headCurrentX, headCurrentY, tailCurrentX, tailCurrentY) || !lastDirection) {
                        tailCurrentY = headCurrentY + 1;
                        tailCurrentX = headCurrentX;
                    }
                    break;
                case 'L':
                    if (isDetached(headCurrentX, headCurrentY, tailCurrentX, tailCurrentY) || !lastDirection) {
                        tailCurrentX = headCurrentX + 1;
                        tailCurrentY = headCurrentY;
                    }
                    break;
                case 'D':
                    if (isDetached(headCurrentX, headCurrentY, tailCurrentX, tailCurrentY) || !lastDirection) {
                        tailCurrentY = headCurrentY - 1;
                        tailCurrentX = headCurrentX;
                    }
                    break;
                case 'R':
                    if (isDetached(headCurrentX, headCurrentY, tailCurrentX, tailCurrentY)|| !lastDirection) {
                        tailCurrentX = headCurrentX - 1;
                        tailCurrentY = headCurrentY;
                    }
                    break;
            }
            // matrix[tailCurrentY][tailCurrentX] = 'T';
        }

        const coordinateString = [tailCurrentX, tailCurrentY].join(',');
        if (!visitedByTail.length || visitedByTail.every(e => e !== coordinateString)) {
            visitedByTail.push(coordinateString);
        }
        lastDirection = direction;
        // await new Promise(resolve => setTimeout(_ => resolve(true), 500));
        // printMatrix(matrix);
        // console.log(tailCurrentX, tailCurrentY, visitedByTail);
    }
}

console.log(`Part 1 result is: ${visitedByTail.length}`);
debugger;
// Part 2


// Utils

function printMatrix(matrix: string[][]): void {
    console.clear();
    console.log(matrix.map(row => row.join('')).join('\n'));
}

function isDetached(headCurrentX: number, headCurrentY: number, tailCurrentX: number, tailCurrentY: number) {
    return ((headCurrentX - tailCurrentX) > 1 || (headCurrentX - tailCurrentX) < -1)
        ||
        ((headCurrentY - tailCurrentY) > 1 || (headCurrentY - tailCurrentY) < -1)
}

