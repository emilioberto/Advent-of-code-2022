import fs from "fs";
import readline from "readline";

const input = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/4/input')
});

for await (const line of readInterface) {
    input.push(line);
}

const pairs = input.map(e => e.split(',').map(e => e.split('-').map(e => +e)));

let fullyContainedCount = 0;
let overlappingCount = 0;
pairs.forEach(pair => {
    const section1 = new Array(pair[0][1] - pair[0][0] + 1).fill(pair[0][0]).map((value, index) => value + index);
    const section2 = new Array(pair[1][1] - pair[1][0] + 1).fill(pair[1][0]).map((value, index) => value + index);

    const group1Set = new Set(section1);
    const group2Set = new Set(section2);

    const mergedSets = new Set([...section1, ...section2]);
    // If the length of distinct numbers sets from section1 and section2 is equal to 1 of the sets it means one set was a complete duplicate.
    if (mergedSets.size === group1Set.size || mergedSets.size === group2Set.size) {
        fullyContainedCount++;
    }
    // The sum is not equal to the merged set then some numbers where removed because they were not distinct
    if ((group1Set.size + group2Set.size) !== mergedSets.size) {
        overlappingCount++;
    }
});

console.log(`Fully contained ${fullyContainedCount}`);
console.log(`Overlapping ${overlappingCount}`);

debugger;
