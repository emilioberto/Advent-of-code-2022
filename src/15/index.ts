import fs from "fs";
import readline from "readline";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/15/input')
});

for await (const line of readInterface) {
    input.push(line);
}
