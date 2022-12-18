import fs from "fs";
import readline from "readline";

class Directory {
    public content: (Directory | File)[] = [];

    public readonly parent: Directory | undefined = undefined;

    constructor(public readonly name: string, parent: Directory) {
        this.parent = parent;
    }

    addDirectory(dir: Directory) {
        this.content.push(dir);
    }

    addFile(file: File) {
        this.content.push(file)
    }

    getContentDirectories(): Directory[] {
        return this.content
            .filter(e => {
                try {
                    assertIsDirectory(e);
                    return true;
                } catch {
                    return false;
                }
            }) as Directory[];
    }


    public getTotalSize(countInnerFolders = false): number {
        return this.content.reduce((total: number, current: Directory | File) => {
            if (current instanceof Directory && countInnerFolders) {
                return total + current.getTotalSize(countInnerFolders);
            } else if (current instanceof File) {
                return total + (current as File).size;
            }
            return total;
        }, 0);
    }
}

class File {
    constructor(public readonly name: string, public readonly size: number) {
    }
}

let input: string[] = [];
const readInterface = readline.createInterface({
    input: fs.createReadStream('./resources/7/input')
});

for await (const line of readInterface) {
    input.push(line);
}

const rootDir = new Directory('/', undefined);

let workingDir: Directory | null = null;
input.forEach(line => {
    if (line.startsWith('$')) {
        line = line.substring(2, input.length);
    }

    const [command, parameter] = line.split(' ');
    workingDir = executeCommand(command, parameter, workingDir);
});

// Part 1

const resultDirs = getDirsWithSizeNoMoreThan(rootDir, 100_000);
const resultPart1 = resultDirs.reduce((tot, currentDir) => {
    return tot + currentDir.getTotalSize(true);
}, 0)

console.log(resultPart1);

// Part 2

const fileSystemTotalSize = 70_000_000;
const requiredSpace = 30_000_000;
const availableSpace = fileSystemTotalSize - rootDir.getTotalSize(true);
const missingSpace = requiredSpace - availableSpace;

const dirsThatCanBeDeletedSizes = getDirsWithSizeMoreThan(rootDir, missingSpace).map(e => e.getTotalSize(true));
const resultPart2 = Math.min(...dirsThatCanBeDeletedSizes);
console.log(resultPart2);

// Utils

function assertIsDirectory(value: unknown): asserts value is Directory {
    if (!(value instanceof Directory)) {
        throw new Error('Not a Directory');
    }
}

function executeCommand(command: string, parameter: string, directory: Directory): Directory {
    if (command === 'cd') {
        switch (parameter) {
            case '/':
                return rootDir;
            case '..':
                return directory.parent;
            default:
                return directory.getContentDirectories().find(e => e.name === parameter) as Directory;
        }
    }
    if (command === 'ls') {
        return directory;
    }

    if (command === 'dir') {
        workingDir.addDirectory(new Directory(parameter, workingDir));
        return workingDir;
    }

    const size = +command;
    workingDir.addFile(new File(parameter, size))
    return workingDir;
}

function getDirsWithSizeNoMoreThan(directory: Directory, size: number): Directory[] {
    let result = [];
    const directorySize = directory.getTotalSize(true)
    if (directorySize <= size) {
        result.push(directory);
    }
    directory.getContentDirectories().forEach(d => result = [...result, ...getDirsWithSizeNoMoreThan(d, size)]);
    return result;
}

function getDirsWithSizeMoreThan(directory: Directory, size: number): Directory[] {
    let result = [];
    const directorySize = directory.getTotalSize(true)
    if (directorySize >= size) {
        result.push(directory);
    }
    directory.getContentDirectories().forEach(d => result = [...result, ...getDirsWithSizeMoreThan(d, size)]);
    return result;
}
