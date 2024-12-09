// import { getInputData } from "./utils/getInputData";
import { getInputData } from "./utils/getInputData";
import { log } from "./utils/logger";

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

function compactDisk(disk: (string | number)[]): (string | number)[] {
  while (true) {
    // Find the last file block
    let lastFileIndex = -1;
    for (let i = disk.length - 1; i >= 0; i--) {
      if (typeof disk[i] === 'number') {
        lastFileIndex = i;
        break;
      }
    }

    // If no file blocks are found, we're done
    if (lastFileIndex === -1) break;

    // Find the first free block
    let firstFreeIndex = -1;
    for (let i = 0; i < disk.length; i++) {
      if (disk[i] === '.') {
        firstFreeIndex = i;
        break;
      }
    }

    // If no free blocks are found, we're done
    if (firstFreeIndex === -1) break;

    // If the last file block is already to the left of the first free block, we're done
    if (lastFileIndex < firstFreeIndex) break;

    // Move the last file block to the first free block
    disk[firstFreeIndex] = disk[lastFileIndex];
    disk[lastFileIndex] = '.';
  }

  return disk;
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

function solveDiskFragmenter(input: string): number {
  const disk = parseDiskMap(input);
  log('Parsed Disk:', disk); // Debug
  const compactedDisk = compactDisk(disk);
  log('Compacted Disk:', compactedDisk); // Debug
  return calculateChecksum(compactedDisk);
}

// Example Input
const exampleInput = '2333133121414131402';
log('Checksum:', solveDiskFragmenter(exampleInput)); // Expected Output: 1928


async function main() {
  const url = 'https://adventofcode.com/2024/day/9/input'
  const inputData = await getInputData(url)

  const result = solveDiskFragmenter(inputData)
  console.log(result)

 
}

// main().catch(console.error)
