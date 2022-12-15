import fs from "fs";
import readline from "readline";

const input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/5/input')
});

for await (const line of readInterface) {
    input.push(line);
}

const crateRows: (string | null)[][] = [];
let numbers: number[] = [];
const procedures: number[][] = [];

input.forEach(i => {
    if (i.includes('[')) {
        crateRows.push(parseCrateRow(i));
        return;
    }

    if (i === '') {
        return;
    }

    if (i.startsWith('move')) {
        const procedureSteps = i.split(' ').filter(e => hasNumber(e)).map(e => +e);
        procedures.push(procedureSteps);
        return;
    }

    if (hasNumber(i)) {
        numbers = i.split(' ').filter(e => hasNumber(e)).map(e => +e);
        return;
    }
});

const stacksPart1 = [];
const stacksPart2 = [];
const stacksNumber = Math.max(...numbers);
crateRows.forEach(row => {
    while (row.length !== stacksNumber) {
        row.push(null);
    }
});

for (let i = 0; i < stacksNumber; i++) {
    const stack = []
    for (let j = crateRows.length - 1; j >= 0; j--) {
        if (crateRows[j][i]) {
            stack.push(crateRows[j][i]);
        }
    }
    stacksPart1.push([...stack]);
    stacksPart2.push([...stack]);
}


// Part 1
procedures.forEach(([elementsToMove, from, to]) => {
    for (let i = 0; i < elementsToMove; i++) {
        stacksPart1[to - 1].push(stacksPart1[from - 1].pop())
    }
})

const resultPart1 = [];
stacksPart1.forEach(stack => {
    if (!stack.length) {
        return;
    }
    resultPart1.push(stack[stack.length - 1]);
})

console.log(`Result of Part 1 is: ${resultPart1.join('')}`);

// Part 2
procedures.forEach(([elementsToMove, from, to]) => {
    const elements = stacksPart2[from - 1].splice(elementsToMove * -1);
    elements.forEach(e => stacksPart2[to - 1].push(e));
})

const resultPart2 = [];
stacksPart2.forEach(stack => {
    if (!stack.length) {
        return;
    }
    resultPart2.push(stack[stack.length - 1]);
})

console.log(`Result of Part 2 is: ${resultPart2.join('')}`);

// Utils

function parseCrateRow(input: string): string[] {
    const result = [];
    while (input.length) {
        const [p1, c, p2, space, ...rest] = [...input];
        input = rest.join('');
        result.push(c === ' ' ? null : c)
    }
    return result;
}

function hasNumber(value: string) {
    return /\d/.test(value);
}
