import fs from "fs";
import readline from "readline";

let input: string[] = [];

const instructions: [Direction, number][] = await getInstructions('./resources/9/input')

type Direction = 'U' | 'L' | 'D' | 'R';

// Part 1

let headY = 0;
let headX = 0;
let tailY = 0;
let tailX = 0;
let lastDirection: Direction | null = null;
let lastHeadX = 0;
let lastHeadY = 0;
let visitedByTail: string[] = [];
const showMatrix = false;

for (const instruction of instructions) {
    const [direction, steps] = instruction;
    for (let i = 0; i < steps; i++) {
        lastHeadX = headX;
        lastHeadY = headY;
        switch (direction) {
            case 'U':
                headY -= 1;
                break;
            case 'L':
                headX -= 1;
                break;
            case 'D':
                headY += 1;
                break;
            case 'R':
                headX += 1;
                break;
        }

        if (shouldFollowHead(lastDirection, direction, lastHeadX, lastHeadY, headX, headY, tailX, tailY)) {
            tailX = lastHeadX;
            tailY = lastHeadY;
        }

        lastDirection = direction;

        const coordinateString = [tailX, tailY].join(',');
        if (!visitedByTail.length || visitedByTail.every(e => e !== coordinateString)) {
            visitedByTail.push(coordinateString);
        }

        if (showMatrix) {
            const size = 100;
            let matrix = [];
            const row = Array(size).fill('.');
            for (let i = 0; i < size; i++) {
                matrix.push([...row]);
            }
            matrix[size - 1 - Math.abs(headY)][Math.abs(headX)] = 'H';
            matrix[size - 1 - Math.abs(tailY)][Math.abs(tailX)] = 'T';
            printMatrix(matrix);
            await new Promise(resolve => setTimeout(_ => resolve(true), 250));
        }
    }
}

console.log(`Part 1 result is: ${visitedByTail.length}`);
debugger;

// Part 2


// Utils

function shouldFollowHead(lastDirection: Direction, currentDirection: Direction, lastHeadX: number, lastHeadY: number, headCurrentX: number, headCurrentY: number, tailCurrentX: number, tailCurrentY: number): boolean {
    if (!lastDirection) {
        return true;
    }
    return isDetached(headCurrentX, headCurrentY, tailCurrentX, tailCurrentY);
}

function printMatrix(matrix: string[][]): void {
    console.clear();
    console.log(matrix.map(row => row.join('')).join('\n'));
}

function isDetached(headCurrentX: number, headCurrentY: number, tailCurrentX: number, tailCurrentY: number) {
    return Math.abs(headCurrentX - tailCurrentX) > 1 || Math.abs(headCurrentY - tailCurrentY) > 1;
}

async function getInstructions(inputFile: string): Promise<[Direction, number][]> {
    const instructions: [Direction, number][] = [];
    const readInterface = readline.createInterface({
        input: fs.createReadStream(inputFile)
    });

    for await (const line of readInterface) {
        input.push(line);
    }
    input.forEach(row => {
        const [direction, steps] = row.split(' ');
        instructions.push([direction as Direction, +steps]);
    });

    return instructions;
}
