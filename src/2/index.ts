import {open} from 'node:fs/promises';

const file = await open('./resources/2/input');

class Shape {
    private readonly winsOn: 'A' | 'B' | 'C';
    private readonly drawsOn: 'A' | 'B' | 'C';
    public readonly points: 1 | 2 | 3;
    constructor(private shape: 'X' | 'Y' | 'Z') {
        switch(shape) {
            case "X":
                this.winsOn = 'C';
                this.drawsOn = 'A';
                this.points = 1;
                break;
            case "Y":
                this.winsOn = 'A';
                this.drawsOn = 'B';
                this.points = 2;
                break;
            case "Z":
                this.winsOn = 'B';
                this.drawsOn = 'C';
                this.points = 3;
                break;
            default:
                throw Error("What?");
        }
    }

    draws(opponent: 'A' | 'B' | 'C'): boolean {
        return opponent === this.drawsOn;
    }

    wins(opponent: 'A' | 'B' | 'C'): boolean {
        return opponent === this.winsOn;
    }
}

let totalScore = 0;
for await (const line of file.readLines()) {
    const [opponentChoice, myChoice] = line.split('').filter(char => char !== ' ') as [a: 'A' | 'B' | 'C', b: 'X' | 'Y' | 'Z'];

    const myShape = new Shape(myChoice);

    if (myShape.draws(opponentChoice)) {
        totalScore+= myShape.points + 3;
        continue;
    }

    if (myShape.wins(opponentChoice)) {
        totalScore+= myShape.points + 6;
        continue;
    }

    totalScore+= myShape.points;
}

console.log(`Total score is ${totalScore}`);
