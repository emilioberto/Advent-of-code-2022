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

const indexes = [];
pairs.forEach((pair, index) => {
    console.log(`== Pair ${index + 1} ==`)
    const isOrdered = checkOrder(pair.first, pair.second, 0);
    console.log('\n');
    if (isOrdered) {
        indexes.push(index + 1);
    }
});

const result = indexes.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
console.log(`The sum of the indexes is: ${result}`);

function checkOrder(first: any[], second: any[], nesting: number): boolean {
    let i = 0;
    nestedLog(`Compare ${JSON.stringify(first)} vs ${JSON.stringify(second)}`, nesting);

    while (i < first.length) {
        const left = first[i];
        const right = second[i];

        nestedLog(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`, nesting + 1);

        if (areUndefined(left, right)) {
            return true;
        }

        if (oneIsUndefined(left, right)) {
            if (left === undefined) {
                nestedLog(`Left side ran out of items, so inputs are in the right order`, nesting + 2);
                return true;
            } else {
                nestedLog(`Right side ran out of items, so inputs are in the right order`, nesting + 2);
                return false;
            }
        }

        if (areNumbers(left, right)) {
            if (left < right) {
                nestedLog(`Left side is smaller, so inputs are in the right order`, nesting + 2);
                return true;
            } else if (left === right) {
                i++;
            } else {
                nestedLog(`Right side is smaller, so inputs are not in the right order`, nesting + 2);
                return false;
            }
            continue;
        }

        if (areArrays(left, right)) {
            let isOrdered = checkOrder(left, right, nesting + 2);
            if (isOrdered === undefined) {
                i++;
                continue;
            }

            return isOrdered;
        }

        if (Array.isArray(left)) {
            nestedLog(`Mixed types; convert right to ${JSON.stringify([left])} and retry comparison`, nesting + 2);
            let isOrdered = checkOrder(left, [right], nesting + 2);
            if (isOrdered === undefined) {
                i++;
                continue;
            }
            return isOrdered;
        } else {
            nestedLog(`Mixed types; convert left to ${JSON.stringify([left])} and retry comparison`, nesting + 2);
            let isOrdered = checkOrder([left], right, nesting + 2);
            if (isOrdered === undefined) {
                i++;
                continue;
            }
            return isOrdered;
        }
    }

    if (i >= first.length) {
        nestedLog(`Left side ran out of items, so inputs are in the right order`, nesting + 1);
        return true;
    }
}

function nestedLog(message: string, nesting: number): void {
    const spaces = nesting * 2;
    console.log(`${' '.repeat(spaces)}- ${message}`.padStart(spaces, ' '));
}

function areUndefined(left: number | [], right: number | []): boolean {
    return left === undefined && right === undefined;
}

function oneIsUndefined(left: number | [], right: number | []): boolean {
    return left === undefined || right === undefined;
}

function areNumbers(left: number | [], right: number | []): boolean {
    return typeof left === 'number' && typeof right === 'number';
}

function areArrays(left: number | [], right: number | []): boolean {
    return Array.isArray(left) && Array.isArray(right);
}

//
// function checkOrder(first: any[], second: any[]): boolean {
//     let i = 0;
//     let continueCheck = true;
//     let ordered = true;
//
//     if (
//         (Array.isArray(first) && first.length > 0) &&
//         (Array.isArray(second) && second.length === 0)
//     ) {
//         return false;
//     }
//
//     if (
//         (Array.isArray(first) && first.length === 0) &&
//         (Array.isArray(second) && second.length < 0)
//     ) {
//         return true;
//     }
//
//     while (i < first.length && continueCheck) {
//         const firstToCompare: number | number[]= first[i];
//         const secondToCompare: number | number[] = second[i];
//
//         if (firstToCompare === undefined && secondToCompare !== undefined) {
//             continueCheck = false;
//             ordered = true;
//         } else if (firstToCompare !== undefined && secondToCompare === undefined) {
//             continueCheck = false;
//             ordered = false;
//         } else if (!Array.isArray(firstToCompare) && !Array.isArray(secondToCompare)) {
//             if (firstToCompare < secondToCompare) {
//                 continueCheck = false;
//                 ordered = true;
//             } else if (firstToCompare == secondToCompare) {
//                 i++;
//             } else {
//                 ordered = false;
//                 continueCheck = false;
//             }
//         } else if (Array.isArray(firstToCompare) && Array.isArray(secondToCompare)) {
//             ordered = checkOrder(firstToCompare, secondToCompare)
//             if (!ordered) {
//                 continueCheck = false;
//             } else {
//                 i++;
//             }
//         } else if (Array.isArray(firstToCompare)) {
//             ordered = checkOrder(firstToCompare, [secondToCompare])
//             if (!ordered) {
//                 continueCheck = false;
//             } else {
//                 i++;
//             }
//         } else if (Array.isArray(secondToCompare)) {
//             ordered = checkOrder([firstToCompare], secondToCompare)
//             if (!ordered) {
//                 continueCheck = false;
//             } else {
//                 i++;
//             }
//         }
//     }
//
//     return ordered;
// }
