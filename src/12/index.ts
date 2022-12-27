import fs from "fs";
import readline from "readline";
import {start} from "repl";

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/12/input')
});

for await (const line of readInterface) {
    input.push(line);
}

class Graph {
    private adjacencyList = new Map<string, string[]>()

    static getKey(x: number, y: number): string {
        return `${x},${y}`;
    }

    static getCoordinateFromKey(key: string): [number, number] {
        const [x, y] = key.split(',').map(e => +e);
        return [x, y];
    }

    getNodeAdjacentList(key: string): string[] {
        return this.adjacencyList.get(key);
    }

    static getStringValue(key: string, matrix: string[][]): string {
        const [x, y] = Graph.getCoordinateFromKey(key)
        return matrix[y][x];
    }

    static getNumericValue(key: string, matrix: string[][]): number {
        const char = Graph.getStringValue(key, matrix);
        switch (char) {
            case 'S':
                return 'a'.charCodeAt(0);
            case 'E':
                return 'z'.charCodeAt(0);
            default:
                return char.charCodeAt(0);
        }
    }

    addNode(key: string) {
        if (this.adjacencyList.has(key)) {
            return;
        }

        this.adjacencyList.set(key, []);
    }

    addEdge(sourceKey: string, destinationKey: string): void {
        const adjacentNodes = this.adjacencyList.get(sourceKey)
        adjacentNodes.push(destinationKey);
    }

    getByChar(char: string): any[] {
        return Array.from(this.adjacencyList)
            .filter(key => {
                const [x, y] = Graph.getCoordinateFromKey(key[0]);
                return matrix[y][x] === char;
            });
    }
}

let matrix: string[][] = [];
const graph = new Graph();

input.forEach(line => {
    matrix.push(line.split(''));
})

let sourceKey;
let targetKey;
let queue = [];
const distances = new Map<string, number>();
const predecessors = new Map<string, string>();

for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    for (let x = 0; x < row.length; x++) {
        const currentStringValue = matrix[y][x];
        const currentNodeKey = Graph.getKey(x, y);
        const currentNumericValue = Graph.getNumericValue(currentNodeKey, matrix);

        if (currentStringValue === 'S') {
            sourceKey = currentNodeKey;
        } else if (currentStringValue === 'E') {
            targetKey = currentNodeKey;
        }

        queue.push(currentNodeKey);
        distances.set(currentNodeKey, currentStringValue === 'S' ? 0 : Infinity);

        graph.addNode(currentNodeKey);

        const adjacentCoordinated = [];
        if (x - 1 >= 0) {
            adjacentCoordinated.push([x - 1, y])
        }
        if (x + 1 < row.length) {
            adjacentCoordinated.push([x + 1, y])
        }
        if (y - 1 >= 0) {
            adjacentCoordinated.push([x, y - 1])
        }
        if (y + 1 < matrix.length) {
            adjacentCoordinated.push([x, y + 1])
        }

        adjacentCoordinated.forEach(([destX, destY]) => {
            const destKey = Graph.getKey(destX, destY);
            const destNumericValue = Graph.getNumericValue(destKey, matrix);

            if (
                (destNumericValue <= currentNumericValue) ||
                (destNumericValue === currentNumericValue + 1)
            ) {
                graph.addEdge(currentNodeKey, destKey);
            }
        })
    }
}

// Part 1
while (queue.length) {
    // Get min element from queue
    const queueDistances = new Map<string, number>();
    queue.forEach(key => queueDistances.set(key, distances.get(key)));
    const minDistance = Math.min(...queueDistances.values());
    const current = Array.from(queueDistances).find(([key, distance], index) => distance === minDistance)[0];
    queue = queue.filter(n => n !== current);

    // DEBUGGING SHIT
    const [x, y] = Graph.getCoordinateFromKey(current);
    const value = matrix[y][x];
    // visited.add(matrix[y][x]);
    //
    // console.clear();
    // const matrixCopy = JSON.parse(JSON.stringify(matrix)) as string[][];
    // matrixCopy[y][x] = 'X';
    // matrixCopy.forEach(row => {
    //     console.log(row.join(''));
    // })
    // await new Promise(resolve => setTimeout(() => resolve(true), 250));

    // DEBUGGED SHIT

    if (current === targetKey) {
        break;
    }

    const currentAdjacentNodes = graph.getNodeAdjacentList(current);
    for (const neighborKey of currentAdjacentNodes) {
        const distanceFromCurrentToNeighbor = distances.get(current) + 1;
        if (distanceFromCurrentToNeighbor < distances.get(neighborKey)) {
            distances.set(neighborKey, distanceFromCurrentToNeighbor);
            predecessors.set(neighborKey, current);
        }
    }
}

let result = [];
let current = targetKey;

if (predecessors.get(current)) {
    while (current) {
        result = [current, ...result];
        current = predecessors.get(current);
    }
}

console.log(result.join(' -> '));
console.log(result.map(e => Graph.getStringValue(e, matrix)).join(' -> '));

const steps = result.length - 1; // Even last step is added
console.log(`Steps required to move from S to E: ${steps}`);

// Part 2

// Utils
