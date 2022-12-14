import {open} from 'node:fs/promises';

const file = await open('./resources/14/input');

class Coordinate {
    constructor(public x: number, public y: number) {
    }
}

const sandSource = new Coordinate(500, 0);

const input = ['498,4 -> 498,6 -> 496,6', '503,4 -> 502,4 -> 502,9 -> 494,9'];
const paths = input.map(line => getPathFromLine(line));
const dropPointSymbol = '+';
const airSymbol = '.';
const rockSymbol = '#';
const sandSymbol = 'o';
const fallingSandSymbol = '~';

const xCoordinates = paths.flatMap(path => path).map(c => c.x);
const yCoordinates = paths.flatMap(path => path).map(c => c.y);
const minX = Math.min(...xCoordinates);
const minY = 0;
const maxX = Math.max(...xCoordinates);
const maxY = Math.max(...yCoordinates);
const dropY = 0;
const dropX = 500 - minX;
const normalizedPaths = paths.map(path => path.map(c => new Coordinate(c.x - minX, c.y)));

const row = Array.from({length: (maxX) - (minX - 1)}, _ => airSymbol);
let rows = Array.from({length: (maxY + 1)}, _ => [...row]);

rows = setDropPoint(rows, new Coordinate(dropX, dropY));

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
                rows[coordinate.y][x] = rockSymbol;
            }
        } else {
            const min = Math.min(coordinate.y, coordinates[index - 1].y);
            const max = Math.max(coordinate.y, coordinates[index - 1].y);
            for (let y = min; y <= max; y++) {
                rows[y][coordinate.x] = rockSymbol;
            }
        }
    });
});

let shouldStop = false;
let count = 0;
while (!shouldStop) {
    const result = dropSand(rows, new Coordinate(dropX, dropY), maxY);
    if (result.y > maxY) {
        shouldStop = true;
    }

    count++;
}

printMatrix(rows);
console.log(count);

function printMatrix(rows: string[][]) {
    const matrix = rows.map(row => row.join(' ')).join('\n');
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

function dropSand(rows: string[][], dropStart: Coordinate, maxY: number): Coordinate {
    let isPositioned = false;
    let yOffset = 0;
    let xOffset = 0;
    const sandCoordinate = new Coordinate(dropStart.x, 0);
    while (!isPositioned || yOffset > maxY) {
        const nextBlock = rows[sandCoordinate.y + yOffset]?.[sandCoordinate.x + xOffset];
        if (nextBlock === airSymbol || nextBlock === dropPointSymbol) {
            yOffset+= 1;
            continue;
        }

        const leftDiagonalBlock = rows[sandCoordinate.y + yOffset + 1]?.[sandCoordinate.x + xOffset - 1];
        if (leftDiagonalBlock === airSymbol || leftDiagonalBlock === dropPointSymbol) {
            yOffset += 2;
            xOffset -= 1;
            continue;
        }

        const rightDiagonalBlock = rows[sandCoordinate.y + yOffset + 1]?.[sandCoordinate.x + xOffset + 1];
        if (rightDiagonalBlock === airSymbol || rightDiagonalBlock === dropPointSymbol) {
            yOffset += 2;
            xOffset += 1;
            continue;
        }

        sandCoordinate.y += yOffset - 1;
        sandCoordinate.x += xOffset;
        rows[sandCoordinate.y][sandCoordinate.x] = sandSymbol;
        isPositioned = true;
        printMatrix(rows);
        return sandCoordinate;
    }

    return
}

function getNextBlock(rows: string[][], sandCoordinate: Coordinate): boolean {
    return rows[sandCoordinate.y][sandCoordinate.x] === airSymbol || rows[sandCoordinate.y][sandCoordinate.x] === dropPointSymbol;
}

