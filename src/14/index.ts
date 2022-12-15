import fs from "fs";
import readline from "readline";
import path from "path";

// const input = ['498,4 -> 498,6 -> 496,6', '503,4 -> 502,4 -> 502,9 -> 494,9'];
const input = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/14/input')
});

for await (const line of readInterface) {
    input.push(line);
}

class Coordinate {
    constructor(public x: number, public y: number) {
    }
}

const paths = input.map(line => getPathFromLine(line));
const dropPointSymbol = '+';
const airSymbol = '.';
const rockSymbol = '#';
const sandSymbol = 'o';
const fallingSandSymbol = '~';

const xCoordinates = paths.flatMap(path => path).map(c => c.x);
const yCoordinates = paths.flatMap(path => path).map(c => c.y);
let margin = 1;
const minX = Math.min(...xCoordinates);
const minY = 0;
const maxX = Math.max(...xCoordinates);
const maxY = Math.max(...yCoordinates);
const dropY = 0;
let dropX = 500 - (minX - margin);
const normalizedPaths = paths.map(path => path.map(c => new Coordinate(c.x - minX, c.y)));


let matrix = generateMatrix();

let shouldStop = false;
while (!shouldStop) {
    const result = dropSand(matrix, new Coordinate(dropX, dropY), maxY);
    if (result.y > maxY) {
        shouldStop = true;
        continue;
    }

    // printMatrix(matrix);
}

console.log(`First problem solution is: ${getSandCount(matrix)}`);

// SECOND PROBLEM

matrix = generateMatrix();

margin = maxX;
dropX = 500 - (minX - margin);
const matrix2 = generateMatrix();
matrix2.push(Array.from({length: (maxX + margin * 2) - (minX - 1)}, _ => airSymbol));
matrix2.push(Array.from({length: (maxX + margin * 2) - (minX - 1)}, _ => rockSymbol));
shouldStop = false;
while (!shouldStop) {
    const result = dropSand(matrix2, new Coordinate(dropX, dropY), maxY, true);
    if (result.y === dropY && result.x === dropX) {
        shouldStop = true;
        continue;
    }
}

console.log(`Second problem solution is: ${getSandCount(matrix2)}`);

// Utils

function generateMatrix() {
    const detailRow = Array.from({length: (maxX + margin * 2) - (minX - 1)}, _ => airSymbol);
    let master = Array.from({length: (maxY + 1)}, _ => [...detailRow]);

    master = setDropPoint(master, new Coordinate(dropX, dropY));

    normalizedPaths.forEach((path, index, paths) => {
        path.forEach((coordinate, index, coordinates) => {
            if (index === 0) {
                return;
            }

            const direction = coordinate.x === coordinates[index - 1].x ? 'vertical' : 'horizontal';
            if (direction === 'horizontal') {
                const min = Math.min(coordinate.x, coordinates[index - 1].x);
                const max = Math.max(coordinate.x, coordinates[index - 1].x);
                for (let x = min; x <= max; x++) {
                    master[coordinate.y][x + margin] = rockSymbol;
                }
            } else {
                const min = Math.min(coordinate.y, coordinates[index - 1].y);
                const max = Math.max(coordinate.y, coordinates[index - 1].y);
                for (let y = min; y <= max; y++) {
                    master[y][coordinate.x + margin] = rockSymbol;
                }
            }
        });
    });
    return master;
}

function printMatrix(rows: string[][]) {
    const matrix = rows.map(row => row.join(' ')).join('\n');
    console.clear();
    console.log(matrix);
}

function getPathFromLine(line: string) {
    return line
        .split(' -> ')
        .map(coordinates => coordinates.split(',').map(c => +c))
        .map(coordinates => new Coordinate(coordinates[0], coordinates[1]))
}

function setDropPoint(rows: string[][], coordinate: Coordinate) {
    rows[coordinate.y][coordinate.x] = dropPointSymbol;
    return rows;
}

function dropSand(m: string[][], dropStart: Coordinate, maxY: number, hasInfiniteFloor = false): Coordinate {
    let isPositioned = false;
    let yOffset = 0;
    let xOffset = 0;
    const sandCoordinate = new Coordinate(dropStart.x, 0);
    while (!isPositioned || yOffset <= maxY) {
        const nextBlock = m[sandCoordinate.y + yOffset]?.[sandCoordinate.x + xOffset];
        if (nextBlock === airSymbol || nextBlock === dropPointSymbol) {
            yOffset += 1;
            continue;
        }

        const leftBlock = m[sandCoordinate.y + yOffset]?.[sandCoordinate.x + xOffset - 1];
        const leftDiagonalBlock = m[sandCoordinate.y + yOffset]?.[sandCoordinate.x + xOffset - 1];
        if (leftBlock === airSymbol && (leftDiagonalBlock === airSymbol || leftDiagonalBlock === dropPointSymbol)) {
            xOffset -= 1;
            continue;
        }

        const rightBlock = m[sandCoordinate.y + yOffset]?.[sandCoordinate.x + xOffset + 1];
        const rightDiagonalBlock = m[sandCoordinate.y + yOffset]?.[sandCoordinate.x + xOffset + 1];
        if (rightBlock === airSymbol && (rightDiagonalBlock === airSymbol || rightDiagonalBlock === dropPointSymbol)) {
            xOffset += 1;
            continue;
        }

        if (!hasInfiniteFloor && yOffset > maxY) {
            sandCoordinate.y += yOffset;
            sandCoordinate.x += xOffset;
            return sandCoordinate;
        }

        if (hasInfiniteFloor && yOffset === maxY) {
            sandCoordinate.y += yOffset -1;
            sandCoordinate.x += xOffset;
            m[sandCoordinate.y][sandCoordinate.x] = sandSymbol;
            isPositioned = true;
            return sandCoordinate;
        }

        sandCoordinate.y += yOffset - 1;
        sandCoordinate.x += xOffset;
        m[sandCoordinate.y][sandCoordinate.x] = sandSymbol;
        isPositioned = true;
        return sandCoordinate;
    }

    return sandCoordinate;
}

function getSandCount(matrix: string[][]): number {
    return matrix.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.filter(e => e === sandSymbol).length;
    }, 0);
}
