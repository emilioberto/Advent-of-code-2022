import { open } from 'node:fs/promises';

const file = await open('./resources/1/input');

let currentElf = 0;
let elfCaloriesList = [0];
for await (const line of file.readLines()) {
    if (line == "") {
        currentElf+=1;
        elfCaloriesList = [...elfCaloriesList, 0];
        continue;
    }

    const calories = +line;
    if (isNaN(calories)) {
        throw new Error("Should never happen broooo");
    }
    elfCaloriesList[currentElf] = elfCaloriesList[currentElf]
        ? elfCaloriesList[currentElf] + calories
        : calories;
}

const topElfCalories = Math.max(...elfCaloriesList);
console.log(`Top elf carries ${topElfCalories}`);

elfCaloriesList.sort((a,b) => b - a);
const topThreeElvesCalories = elfCaloriesList[0] + elfCaloriesList[1] + elfCaloriesList[2];
console.log(`Top 3 elves carry ${topThreeElvesCalories}`);
