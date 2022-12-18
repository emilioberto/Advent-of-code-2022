import fs from "fs";
import readline from "readline";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/8/input')
});

for await (const line of readInterface) {
    input.push(line);
}

// Part 1

// Part 2

// Utils
