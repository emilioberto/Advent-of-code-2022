import fs from "fs";
import readline from "readline";

let input: string[] = [];

const instructions: [Direction, number][] = await getInstructions('./resources/9/testinput')

type Direction = 'U' | 'L' | 'D' | 'R';

// Part 1

let lastDirection: Direction | null = null;
let visitedByTail: string[] = [];

const numberOfTails = 1;
const positionMap = new Map<string | number, [number, number]>([
    [0, [0, 0]]
])
for (let i = 1; i <= numberOfTails; i++) {
    positionMap.set(i, [0, 0]);
}

function calculateNewPosition(targetX: number, targetY: number, currentX: number, currentY: number) {
    if ((targetX - currentX) === 2) { // RIGHT
        return [currentX + 1, targetY];
    } else if (targetX - currentX === -2) { // LEFT
        return [targetX - 1, targetY];
    } else if ((targetY - currentY) === 2) { // UP
        return [targetX, targetY + 1];
    } else if (targetY - currentY === -2) { // DOWN
        return [targetX, targetY - 1];
    }
}

const updateMap = new Map<Direction, [number, number]>([
    ['U', [0, -1]],
    ['L', [-1, 0]],
    ['D', [0, 1]],
    ['R', [1, 0]],
]);


for (const instruction of instructions) {
    const [direction, steps] = instruction;
    for (let i = 0; i < steps; i++) {

        const directionChange = updateMap.get(direction);
        const head = positionMap.get(0);
        positionMap.set(0, [head[0] + directionChange[0], head[1] + directionChange[1]]);

        for (let j = 1; j <= numberOfTails; j++) {
            const [x, y] = positionMap.get(j - 1)
            const shouldFollow = shouldFollowHead(
                lastDirection, direction,
                x, y,
                positionMap.get(j)[0], positionMap.get(j)[1]
            );
            if (shouldFollow) {
                const [targetX, targetY] = [x, y];
                positionMap.set(j, [targetX + directionChange[0], targetY + directionChange[1]]);
            }
        }

        lastDirection = direction;

        const lastTail = positionMap.get(numberOfTails);
        const coordinateString = [lastTail[0], lastTail[1]].join(',');
        if (!visitedByTail.length || visitedByTail.every(e => e !== coordinateString)) {
            visitedByTail.push(coordinateString);
        }

        // if (1) {
        //     const size = 10;
        //     let matrix = [];
        //     const row = Array(size).fill('.');
        //     for (let i = 0; i < size; i++) {
        //         matrix.push([...row]);
        //     }
        //
        //     for (let j = 0; j <= numberOfTails; j++) {
        //         const position = positionMap.get(j);
        //         matrix[(size - 1) - position[1]][position[0]] = j === 0 ? 'H' : 'T';
        //     }
        //
        //     printMatrix(matrix);
        //     await new Promise(resolve => setTimeout(_ => resolve(true), 500));
        // }
    }
}


console.log(`Part 1 result is: ${visitedByTail.length}`);

// Part 2

debugger;

// Utils

function shouldFollowHead(lastDirection: Direction, currentDirection: Direction, headX: number, headY: number, tailX: number, tailY: number): boolean {
    return isDetached(headX, headY, tailX, tailY);
}

function printMatrix(matrix: string[][]): void {
    console.clear();
    console.log(matrix.map(row => row.join('')).join('\n'));
}

function isDetached(headX: number, headY: number, tailX: number, tailY: number) {
    return Math.abs(headX - tailX) > 1 || Math.abs(headY - tailY) > 1;
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
