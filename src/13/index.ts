import fs from "fs";
import readline from "readline";
import {start} from "repl";
import {isArray} from "util";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/13/input')
});

for await (const line of readInterface) {
    if (line === '') {
        continue;
    }
    input.push(line);
}

let pairs: { first: [], second: [] }[] = [];

for (let i = 0; i < input.length; i += 2) {
    const first = JSON.parse(input[i]);
    const second = JSON.parse(input[i + 1]);
    pairs.push({
        first,
        second
    });
}

// Part 1

const indexes = [];
pairs.forEach((pair, index) => {
    console.log(`== Pair ${index + 1} ==`)
    const isOrdered = isPairOrdered(pair.first, pair.second, 0, true, true);
    console.log('\n');
    if (isOrdered) {
        indexes.push(index + 1);
    }
});

const result = indexes.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
console.log(`The sum of the indexes is: ${result}`);

// Part 2

const additionalPackage1 = '[[2]]';
const additionalPackage2 = '[[6]]';
const unordered = [JSON.parse(additionalPackage1), JSON.parse(additionalPackage2)];
input.forEach(packet => unordered.push(JSON.parse(packet)));

const sorted = unordered.sort((a, b) => {
    return isPairOrdered(a, b, 0, true, false) ? -1 : 1;
})

const package1Index = sorted.findIndex(packet => JSON.stringify(packet) === additionalPackage1) + 1;
const package2Index = sorted.findIndex(packet => JSON.stringify(packet) === additionalPackage2) + 1;

console.log(`The decoder key for the distress signal is: ${package1Index * package2Index}`);

function isPairOrdered(first: any[], second: any[], nesting: number, isEntryPoint = false, logEnabled: boolean): boolean {
    nestedLog(`Compare ${JSON.stringify(first)} vs ${JSON.stringify(second)}`, nesting, logEnabled);

    const size = Math.max(first.length, second.length);
    for (let i = 0; i < size; i++) {

        if (i + 1 > first.length) {
            nestedLog(`Left side ran out of items, so inputs are in the right order`, nesting + 2, logEnabled);
            return true;
        } else if (i + 1 > second.length) {
            nestedLog(`Right side ran out of items, so inputs are not in the right order`, nesting + 2, logEnabled);
            return false;
        }

        const left = first[i];
        const right = second[i];

        nestedLog(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`, nesting + 1, logEnabled);

        if (areNumbers(left, right)) {
            if (left < right) {
                nestedLog(`Left side is smaller, so inputs are in the right order`, nesting + 2, logEnabled);
                return true;
            } else if (left > right) {
                nestedLog(`Right side is smaller, so inputs are not in the right order`, nesting + 2, logEnabled);
                return false;
            }
            continue;
        }

        if (areArrays(left, right)) {
            let isOrdered = isPairOrdered(left, right, nesting + 2, false, logEnabled);
            if (isOrdered === undefined) {
                continue;
            }

            return isOrdered;
        }

        if (Array.isArray(left)) {
            nestedLog(`Mixed types; convert right to ${JSON.stringify([right])} and retry comparison`, nesting + 2, logEnabled);
            let isOrdered = isPairOrdered(left, [right], nesting + 2, false, logEnabled);
            if (isOrdered === undefined) {
                continue;
            }
            return isOrdered;
        } else {
            nestedLog(`Mixed types; convert left to ${JSON.stringify([left])} and retry comparison`, nesting + 2, logEnabled);
            let isOrdered = isPairOrdered([left], right, nesting + 2, false, logEnabled);
            if (isOrdered === undefined) {
                continue;
            }
            return isOrdered;
        }
    }

    if (isEntryPoint) {
        nestedLog(`Left side ran out of items, so inputs are in the right order`, nesting + 1, logEnabled);
        return true;
    }
}

function nestedLog(message: string, nesting: number, logEnabled: boolean): void {
    if (!logEnabled) {
        return;
    }

    const spaces = nesting * 2;
    console.log(`${' '.repeat(spaces)}- ${message}`.padStart(spaces, ' '));
}

function areNumbers(left: number | [], right: number | []): boolean {
    return typeof left === 'number' && typeof right === 'number';
}

function areArrays(left: number | [], right: number | []): boolean {
    return Array.isArray(left) && Array.isArray(right);
}

function partition(items: any[], left: number, right: number) {

    let pivot = items[Math.floor((right + left) / 2)],
        i = left,
        j = right;

    while (i <= j) {
        //increment left pointer if the value is less than the pivot
        while (isPairOrdered(items[i], pivot, 0, true, false)) {
            i++;
        }

        //decrement right pointer if the value is more than the pivot
        while (isPairOrdered(pivot, items[j], 0, true, false)) {
            j--;
        }

        //else we swap.
        if (i <= j) {
            [items[i], items[j]] = [items[j], items[i]];
            i++;
            j--;
        }
    }

    //return the left pointer
    return i;
}

function quickSort(items, left, right) {
    let index;

    if (items.length > 1) {
        index = partition(items, left, right);

        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }

        if (index < right) {
            quickSort(items, index, right);
        }
    }

    return items;
}
