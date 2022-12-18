import fs from "fs";
import readline from "readline";

let input = '';
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/7/input')
});

for await (const line of readInterface) {
    input += line;
}

// Part 1

// Part 2

// Utils
