import fs from "fs";
import readline from "readline";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/15/input')
});

for await (const line of readInterface) {
    input.push(line);
}

const data: { sensor: { x: number, y: number }, beacon: { x: number, y: number } }[] = [];
input.forEach(line => {
    const regex = new RegExp(/x=(-?\d+), y=(-?\d+)/g);
    const result = line.matchAll(regex);
    const sensor = result.next().value;
    const [sensorX, sensorY] = [parseInt(sensor[1]), parseInt(sensor[2])];
    const beacon = result.next().value;
    const [beaconX, beaconY] = [parseInt(beacon[1]), parseInt(beacon[2])];

    data.push({
        sensor: {x: sensorX, y: sensorY},
        beacon: {x: beaconX, y: beaconY},
    });
});


const y = 2000000;
const result = new Set();
const dataToCheck = [];

for (const element of data) {
    const closestBeaconDistance = Math.abs(element.beacon.x - element.sensor.x) + Math.abs(element.beacon.y - element.sensor.y);
    const maxSensorY = element.sensor.y + closestBeaconDistance;
    const minSensorY = element.sensor.y - closestBeaconDistance;
    if (y >= minSensorY && y <= maxSensorY) { // Included in sensor range
        dataToCheck.push(element);
    }
}

const beaconOrSensorsInY = new Set();
for (const element of dataToCheck) { // Let's get all the beacons and sensors on Y
    if (element.beacon.y === y) {
        beaconOrSensorsInY.add(element.beacon.x);
    }
    if (element.sensor.y === y) {
        beaconOrSensorsInY.add(element.sensor.x);
    }
}

for (const element of dataToCheck) {
    const closestBeaconDistance = Math.abs(element.beacon.x - element.sensor.x) + Math.abs(element.beacon.y - element.sensor.y);

    if (closestBeaconDistance === 0) {
        break;
    }

    for (let currentY = 0; currentY <= closestBeaconDistance; currentY++) {
        if ((element.sensor.y + currentY) !== y && (element.sensor.y - currentY) !== y) {
            continue;
        }

        const elementsToAddOnLeftAndRight = closestBeaconDistance - currentY; // Each step over we add 1 element less on left and 1 less on right...

        // Left
        for(let x = 1; x <= elementsToAddOnLeftAndRight; x++){
            const nonBeaconX = element.sensor.x - x;
            if (beaconOrSensorsInY.has(nonBeaconX)) {
                continue;
            }
            result.add(nonBeaconX);
        }

        // Right
        for(let x = 0; x <= elementsToAddOnLeftAndRight; x++){
            const nonBeaconX = element.sensor.x + x;
            if (beaconOrSensorsInY.has(nonBeaconX)) {
                continue;
            }
            result.add(nonBeaconX);
        }
    }
}

console.log(`In the row where y=${y}, there are ${result.size} positions that cannot contain a beacon!`)
