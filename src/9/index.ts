import fs from "fs";
import readline from "readline";

let input: string[] = [];

const instructions: [Direction, number][] = await getInstructions('./resources/9/testinput2')

class Coordinate {
    constructor(public x: number, public y: number) {
    }

    shouldMove(previous: Coordinate): boolean {
        return Math.abs(previous.x - this.x) > 1 || Math.abs(previous.y - this.y) > 1;
    }

    shouldMoveNormally(previous: Coordinate): boolean {
        return (Math.abs(previous.x - this.x) == 2 && previous.y === this.y) || (Math.abs(previous.y - this.y) == 2 && previous.x === this.x);
    }

    move(direction: Direction): void {
        switch (direction) {
            case "U":
                this.y--;
                break;
            case "L":
                this.x--;
                break;
            case "D":
                this.y++;
                break;
            case "R":
                this.x++;
                break;
        }
    }

    moveTo(previous: Coordinate): void {
        this.x -= Math.sign(this.x - previous.x);
        this.y -= Math.sign(this.y - previous.y);
    }

    moveDiagonally(direction: Direction, previous: Coordinate): void {
        this.move(direction);
        switch (direction) {
            case "U":
            case "D":
                this.x += previous.x > this.x ? 1 : -1;
                break;
            case "L":
            case "R":
                this.y += previous.y > this.y ? 1 : -1;
                break;
        }
    }
}

type Direction = 'U' | 'L' | 'D' | 'R';

const size = 10;
const rope = Array.from(Array(size), () => new Coordinate(15, 15));
const head = rope[0];
const visitedByTail = new Set();

// Part 1

for (const instruction of instructions) {
    const [direction, moves] = instruction;

    for (let i = 0; i < moves; i++) {
        head.move(direction);

        for (let j = 1; j < size; j++) {
            printMatrix();
            const current = rope[j];
            const previous = rope[j - 1];

            if (current.shouldMove(previous)) {
                current.moveTo(previous);
            }
        }
        const lastTail = rope[size - 1];
        const lastTailCoordinate = [lastTail.x, lastTail.y].join(',');
        visitedByTail.add(lastTailCoordinate);
    }

}

console.log(`Result is: ${visitedByTail.size}`);

function printMatrix(): void {
    const matrix = [];
    const row = Array(30).fill('.');
    for (let i = 0; i < 30; i++) {
        matrix.push([...row]);
    }

    for (let j = size - 1; j >= 0; j--) {
        const position = rope[j];
        matrix[position.y][position.x] = j === 0 ? 'H' : j + 1;
    }
    console.clear();
    console.log(matrix.map(row => row.join('')).join('\n'));
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

async function sleep(number: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), number));
}
