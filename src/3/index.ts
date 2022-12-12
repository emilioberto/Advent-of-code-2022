import {open} from 'node:fs/promises';

const file = await open('./resources/3/input');

let total = 0;
for await (const line of file.readLines()) {
    const compartment1 = line.substring(0, line.length / 2);
    const compartment2 = line.substring(line.length / 2);

    const distinctCompartment1 = new Set(compartment1);
    const distinctCompartment2 = new Set(compartment2);

    const result = Array.from(distinctCompartment1).filter(x => Array.from(distinctCompartment2).some(y => y === x));

    total += getValue(result[0]);
}

console.log(`Total: ${total}`);

function getValue(char: string): number {
    let result = char.charCodeAt(0);
    if (result < 97) {
        return result - 38;
    }

    return result - 96;
}
