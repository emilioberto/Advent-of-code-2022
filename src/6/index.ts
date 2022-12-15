import fs from "fs";
import readline from "readline";

let input = '';
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/6/input')
});

for await (const line of readInterface) {
    input += line;
}

// Part 1
let index = 0;
let found = false;
let source = input;
while (!found) {
    const [a, b, c, d, ...rest] = source;
    const markers = new Set([a, b, c, d]);
    found = markers.size === 4;
    if (!found) {
        source = [b, c, d, ...rest].join('');
        index++;
    }
}
const resultPart1 = index += 4;
console.log(`Result of Part 1 is: ${resultPart1}`);

// Part 2
index = 0;
found = false;
source = input;
while (!found) {
    const test = source.slice(index, index + 14);
    found = new Set(test).size === 14;

    if (!found) {
        index++;
    }
}

const resultPart2 = index + 14;
console.log(`Result of Part 2 is: ${resultPart2}`);

// Utils
