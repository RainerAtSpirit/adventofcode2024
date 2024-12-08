import { getInputData } from './utils/getInputData'

function sumMulInstructions(input: string): number {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g
  let match
  let sum = 0

  while ((match = regex.exec(input)) !== null) {
    const x = parseInt(match[1], 10)
    const y = parseInt(match[2], 10)
    sum += x * y
  }

  return sum
}

async function main() {
  const url = 'https://adventofcode.com/2024/day/3/input'
  const inputData = await getInputData(url)
  console.log(sumMulInstructions(inputData)) // sh
}

main().catch(console.error)
