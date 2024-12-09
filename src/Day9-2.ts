// import { getInputData } from "./utils/getInputData";
import { getInputData } from "./utils/getInputData";
import { log } from "./utils/logger";


// Assuming the following utility functions are defined:
import { getInputData } from "./utils/getInputData";
import { log } from "./utils/logger";

interface File {
  id: number;
  startIndex: number;
  size: number;
}

function parseDiskMap(diskMap: string): (string | number)[] {
  const disk: (string | number)[] = [];
  let isFile = true; // Start with files
  let fileID = 0;

  for (const length of diskMap) {
    const blockCount = parseInt(length, 10);
    for (let i = 0; i < blockCount; i++) {
      if (isFile) {
        disk.push(fileID);
      } else {
        disk.push('.');
      }
    }
    if (isFile) fileID++; // Increment file ID after file blocks
    isFile = !isFile; // Alternate between file and free space
  }

  return disk;
}

function identifyFiles(disk: (string | number)[]): File[] {
  const files: File[] = [];
  let currentFileId: number | null = null;
  let startIndex: number = 0;
  let size: number = 0;

  disk.forEach((block, index) => {
    if (typeof block === 'number') {
      if (currentFileId === block) {
        size++;
      } else {
        if (currentFileId !== null) {
          files.push({ id: currentFileId, startIndex, size });
        }
        currentFileId = block;
        startIndex = index;
        size = 1;
      }
    } else {
      if (currentFileId !== null) {
        files.push({ id: currentFileId, startIndex, size });
        currentFileId = null;
      }
    }
  });

  // Push the last file if the disk ends with a file
  if (currentFileId !== null) {
    files.push({ id: currentFileId, startIndex, size });
  }

  return files;
}

function sortFilesDescending(files: File[]): File[] {
  return [...files].sort((a, b) => b.id - a.id);
}

function findLeftmostFreeSpan(disk: (string | number)[], size: number): number | null {
  let consecutiveFree = 0;
  let start = 0;

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === '.') {
      if (consecutiveFree === 0) {
        start = i;
      }
      consecutiveFree++;
      if (consecutiveFree === size) {
        return start;
      }
    } else {
      consecutiveFree = 0;
    }
  }

  return null;
}

function moveFile(disk: (string | number)[], file: File, targetIndex: number): (string | number)[] {
  const newDisk = [...disk];

  // Replace target span with file blocks
  for (let i = 0; i < file.size; i++) {
    newDisk[targetIndex + i] = file.id;
  }

  // Replace original file blocks with free space
  for (let i = 0; i < file.size; i++) {
    newDisk[file.startIndex + i] = '.';
  }

  return newDisk;
}

function compactDiskPartTwo(disk: (string | number)[]): (string | number)[] {
  const files = identifyFiles(disk);
  log('Identified Files:', files);
  const sortedFiles = sortFilesDescending(files);
  log('Sorted Files (Descending):', sortedFiles);
  let updatedDisk = [...disk];

  sortedFiles.forEach((file) => {
    const targetIndex = findLeftmostFreeSpan(updatedDisk, file.size);
    if (targetIndex !== null && targetIndex < file.startIndex) {
      log(`Moving File ID ${file.id} from index ${file.startIndex} to ${targetIndex}`);
      updatedDisk = moveFile(updatedDisk, file, targetIndex);
      log('Disk State After Move:', updatedDisk);
    } else {
      log(`Cannot move File ID ${file.id} (No suitable free space)`);
    }
  });

  return updatedDisk;
}

function calculateChecksum(disk: (string | number)[]): number {
  let checksum = 0;

  for (let i = 0; i < disk.length; i++) {
    const block = disk[i];
    if (typeof block === 'number') {
      checksum += i * block;
    }
  }

  return checksum;
}

function solveDiskFragmenterPartTwo(input: string): number {
  const disk = parseDiskMap(input);
  log('Parsed Disk:', disk); // Debug
  const compactedDisk = compactDiskPartTwo(disk);
  log('Compacted Disk:', compactedDisk); // Debug
  return calculateChecksum(compactedDisk);
}

// Example Input
const exampleInput = '2333133121414131402';
log('Checksum:', solveDiskFragmenterPartTwo(exampleInput)); // Expected Output: 2858

async function main() {
  const url = 'https://adventofcode.com/2024/day/9/input'
  const inputData = await getInputData(url)

  const result = solveDiskFragmenterPartTwo(inputData)
  console.log(result)

 
}

// main().catch(console.error)
