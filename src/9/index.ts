import fs from "fs";
import readline from "readline";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/9/testinput')
});

for await (const line of readInterface) {
    input.push(line);
}

const instructions: [string, number][] = [];
input.forEach(row => {
    const [direction, _, steps] = row;
    instructions.push([direction, +steps]);
})

// Part 1

const size = 20;
const matrix = Array(size).fill([]).map(row => Array(size).fill('.'));
matrix[size - 1][0] = 'H';

let headCurrentY = size - 1;
let headCurrentX = 0;

let tailCurrentY = size - 1;
let tailCurrentX = 0;

let lastDirection: string | null;

for (const instruction of instructions) {
    const [direction, steps] = instruction;
    printMatrix(matrix);
    for (let i = 0; i < steps; i++) {
        matrix[headCurrentY][headCurrentX] = '.';
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
        matrix[headCurrentY][headCurrentX] = 'H';
        matrix[tailCurrentY][tailCurrentX] = '.';

        // if (lastDirection && lastDirection === direction) {
        //     if (
        //         ((tailCurrentX - headCurrentX) < -1 || (tailCurrentX - headCurrentX) > 1)
        //         ||
        //         ((tailCurrentY - headCurrentY) < -1 || (tailCurrentY - headCurrentY)  > 1)
        //     ) {
        //         switch (direction) {
        //             case 'U':
        //                 tailCurrentX = headCurrentX;
        //                 tailCurrentY = headCurrentY + 1;
        //                 break;
        //             case 'L':
        //                 tailCurrentY = headCurrentY;
        //                 tailCurrentX = headCurrentX - 1;
        //                 break;
        //             case 'D':
        //                 tailCurrentX = headCurrentX;
        //                 tailCurrentY = headCurrentY - 1;
        //                 break;
        //             case 'R':
        //                 tailCurrentY = headCurrentY;
        //                 tailCurrentX = headCurrentX + 1;
        //                 break;
        //         }
        //     } else {
        //         switch (direction) {
        //             case 'U':
        //                 tailCurrentY -= 1;
        //                 break;
        //             case 'L':
        //                 tailCurrentX -= 1;
        //                 break;
        //             case 'D':
        //                 tailCurrentY += 1;
        //                 break;
        //             case 'R':
        //                 tailCurrentX += 1;
        //                 break;
        //         }
        //     }
        // }
        matrix[tailCurrentY][tailCurrentX] = 'T';

        lastDirection = direction;
        await new Promise(r => setTimeout(r, 1000));
        printMatrix(matrix);
    }
}

instructions.forEach(([direction, steps]) => {
});


// Part 2


// Utils

function printMatrix(matrix: string[][]): void {
    console.clear();
    console.log(matrix.map(row => row.join('')).join('\n'));
}
