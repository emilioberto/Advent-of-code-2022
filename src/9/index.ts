import fs from "fs";
import readline from "readline";

let input: string[] = [];

const instructions: [Direction, number][] = await getInstructions('./resources/9/testinput')

type Direction = 'U' | 'L' | 'D' | 'R';

// Part 1

let headY = 0;
let headX = 0;
let lastDirection: Direction | null = null;
let visitedByTail: string[] = [];
const showMatrix = true;

const numberOfTails = 9;
let tailsPositions = Array(numberOfTails).fill([headX, headY]);
let headLastNPositions = Array(numberOfTails).fill([headX, headY]);

for (const instruction of instructions) {
    const [direction, steps] = instruction;
    for (let i = 0; i < steps; i++) {
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

        for (let j = 0; j < numberOfTails; j++) {
            const shouldFollow = shouldFollowHead(lastDirection, direction, headLastNPositions[j][0], headLastNPositions[j][1], headX, headY, tailsPositions[j][0], tailsPositions[j][1]);
            if (shouldFollow) {
                tailsPositions[j] = headLastNPositions[j];
            }
        }

        headLastNPositions = [[headX, headY], ...headLastNPositions];
        lastDirection = direction;

        const coordinateString = [tailsPositions[numberOfTails - 1][0], tailsPositions[numberOfTails - 1][1]].join(',');
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
            tailsPositions.forEach(([tailX, tailY]) => {
                matrix[size - 1 - Math.abs(tailY)][Math.abs(tailX)] = 'T';
            })
            printMatrix(matrix);
            await new Promise(resolve => setTimeout(_ => resolve(true), 500));
        }
    }
}

console.log(`Part 1 result is: ${visitedByTail.length}`);

// Part 2

debugger;

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
