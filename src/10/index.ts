import fs from "fs";
import readline from "readline";

let input: [string, number][] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/10/input')
});

for await (const line of readInterface) {
    const [instruction, value] = line.split(' ');
    input.push([instruction, +value]);
}

let X = 1;
let totalCycles = 0;

let results = [];
let pixels = [];
input.forEach(line => {
   const [instruction, value] = line;
   let instructionCycles = 0;
   switch (instruction) {
       case 'noop':
           instructionCycles = 1;
           break;
       case 'addx':
           instructionCycles = 2;
           break;
   }

    for (let instructionCycle = 1; instructionCycle <= instructionCycles; instructionCycle++) {

        const spritePixels = [X - 1, X, X+1];
        if (spritePixels.includes(totalCycles % 40)) {
            pixels.push('#');
        } else {
            pixels.push('.')
        }

        totalCycles++;
        switch((totalCycles - 20) % 40) {
            case 0:
                results.push({
                    cycles: totalCycles,
                    X: X * totalCycles
                });
                break;
            default:
                break;
        }

        if (instructionCycle !== instructionCycles) {
            continue;
        }

        if (instruction === 'addx') {
            X+= value;
        }
    }
});

const result = results.reduce((tot, curr) => (tot+= curr.X), 0)
console.log(`Part 1 result is: ${result}`);

const chunkSize = 40;
for (let i = 0; i < pixels.length; i += chunkSize) {
    const chunk = pixels.slice(i, i + chunkSize);
    console.log(chunk.join(''));
}


// Part 2

// Utils
