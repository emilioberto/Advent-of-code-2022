import readline from "readline";
import fs from "fs";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/3/input')
});

for await (const line of readInterface) {
    input.push(line);
}


let resultPart1 = 0;

// Part 1
input.forEach(line => {
    const compartment1 = line.substring(0, line.length / 2);
    const compartment2 = line.substring(line.length / 2);

    const distinctCompartment1 = new Set(compartment1);
    const distinctCompartment2 = new Set(compartment2);

    const result = Array.from(distinctCompartment1).filter(x => Array.from(distinctCompartment2).some(y => y === x));

    resultPart1 += getValue(result[0]);
});

console.log(`Result part 1: ${resultPart1}`);

// Part 2

let inputCopy: string[] = [...input];
const groups: string[][][]= [];
while (inputCopy.length > 0) {
    const [rucksack1, rucksack2, rucksack3, ...rest] = inputCopy;
    inputCopy = [...rest];
    groups.push([[...rucksack1], [...rucksack2], [...rucksack3]]);
}

let resultPart2 = 0;
groups.forEach(([rucksack1, rucksack2, rucksack3]) => {
    const mergedRucksacks = [...rucksack1, ...rucksack2, ...rucksack3];

    const resultWithDuplicates = [...mergedRucksacks].filter(e => rucksack1.some(x => x === e) && rucksack2.some(y => y === e) && rucksack3.some(z => z === e))

    const result = Array.from(new Set(resultWithDuplicates));

    if (result.length !== 1) {
        throw new Error('WAZZUP BRO??????')
    }

    resultPart2 += getValue(result[0]);
});

console.log(`Result part 2: ${resultPart2}`);

// Utils

function getValue(char: string): number {
    let result = char.charCodeAt(0);
    if (result < 97) {
        return result - 38;
    }

    return result - 96;
}
