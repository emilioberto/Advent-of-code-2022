import fs from "fs";
import readline from "readline";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/11/testinput')
});

class Monkey {
    id: number;
    items: number[];
    operation: (itemValue) => number;
    optimize: (value) => number;
    test: (x: number) => boolean;
    testTrueMonkey: number;
    testFalseMonkey: number;
    inspections: number = 0;
}


let monkeys = await GetMonkeysFromInput();
const useWorryReducer = false;
const rounds = 10000;
const roundsToLog = [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

for (let i = 1; i <= 10000; i++) {
    if (roundsToLog.includes(i)) {
        console.log(`== After round ${i} ==`);
    }
    monkeys.forEach(monkey => {
        // console.log(`Monkey ${monkey.id}: `)
        let hasItems = monkey.items?.length > 0;
        while (hasItems) {
            monkey.inspections++;
            const [item, ...otherItems] = monkey.items;
            monkey.items = [...otherItems];
            const worryLevel = monkey.operation(item);
            logWithTab(`Monkey inspects an item with a worry level of ${item}.`);
            logWithTab(`Worry level is multiplied and is now: ${worryLevel}.`);
            let updatedWorry = worryLevel;
            if (useWorryReducer) {
                updatedWorry = Math.floor(worryLevel / 3);
                logWithTab(`Monkey gets bored with item. Worry level is divided by 3 to  ${updatedWorry}.`);
            }
            const testResult = monkey.test(updatedWorry);
            const destination = monkeys.find(m => m.id === (testResult ? monkey.testTrueMonkey : monkey.testFalseMonkey));

            // if (!useWorryReducer) {
            //     updatedWorry = destination.optimize(updatedWorry);
            // }
            destination.items.push(updatedWorry);
            logWithTab(`Item with worry level ${updatedWorry} is thrown to monkey ${destination.id}`);

            hasItems = monkey.items?.length > 0;
        }
        if (roundsToLog.includes(i)) {
            console.log(`Monkey ${monkey.id} inspected items ${monkey.inspections} times.`);
        }
    })
}

const sortedMonkeyInspections = monkeys.map(e => e.inspections).sort((a, b) => b - a);
console.log(`Monkey business: ${sortedMonkeyInspections[0] * sortedMonkeyInspections[1]}`)

// Part 2

// Utils

function logWithTab(message: string): void {
    // console.log(`    ${message}`);
}

async function GetMonkeysFromInput() {
    let monkeys: Monkey[] = [];
    let monkey = new Monkey();
    for await (const line of readInterface) {
        if (line.startsWith("Monkey")) {
            const startIndex = line.indexOf("Monkey") + "Monkey".length;
            const endIndex = line.indexOf(":");
            const output = line.substring(startIndex, endIndex).trim();
            monkey.id = +output;
            continue;
        }

        if (line.includes("Starting items:")) {
            const regex = new RegExp(/\b(\d+(?:, \d+)*)\b/);
            const match = line.match(regex);
            if (match) {
                const numbers = match[0].split(',');
                monkey.items = [...numbers.map(e => +e)];
            }
            continue;
        }

        if (line.includes("Operation: new = old ")) {
            const parts = line.split('= old ');
            if (parts.length === 2) {
                const result = parts[1].trim();
                const [sign, rightValue] = result.split(' ');

                switch (sign) {
                    case '+':
                        monkey.operation = (value) => value + (rightValue === 'old' ? value : +rightValue);
                        break;
                    case '*':
                        monkey.operation = (value) => value * (rightValue === 'old' ? value : +rightValue);
                        break;
                }
            }
            continue;
        }

        if (line.includes("Test: divisible by ")) {
            const parts = line.split('Test: divisible by ');
            if (parts.length === 2) {
                const divideBy = +parts[1].trim();
                monkey.test = (x) => x % divideBy === 0;
                monkey.optimize = (x) => {
                    if (x % divideBy === 0) {
                        return 0;
                    }
                    return x;
                };
            }
            continue;
        }

        if (line.includes("If true: throw to monkey ")) {
            const parts = line.split('If true: throw to monkey ');
            if (parts.length === 2) {
                monkey.testTrueMonkey = +parts[1].trim();
            }
            continue;
        }

        if (line.includes("If false: throw to monkey ")) {
            const parts = line.split('If false: throw to monkey ');
            if (parts.length === 2) {
                monkey.testFalseMonkey = +parts[1].trim();
            }
            monkeys.push(monkey);
            monkey = new Monkey();
        }
    }
    return monkeys;
}
