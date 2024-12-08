import { getInputData } from './utils/getInputData'

function isSafeLine(levels: Array<number>): boolean {
  const n = levels.length
  if (n < 2) return false

  const firstDiff = levels[1] - levels[0]
  if (firstDiff === 0 || Math.abs(firstDiff) > 3) {
    return false
  }

  const increasing = firstDiff > 0

  for (let i = 2; i < n; i++) {
    const diff = levels[i] - levels[i - 1]
    if (diff === 0 || Math.abs(diff) > 3) {
      return false
    }
    if (increasing && diff <= 0) return false
    if (!increasing && diff >= 0) return false
  }

  return true
}

function isSafeWithDampener(levels: Array<number>): boolean {
  // Check if already safe
  if (isSafeLine(levels)) {
    return true
  }

  // Try removing each element once and check again
  for (let i = 0; i < levels.length; i++) {
    const newLevels = levels.filter((_, index) => index !== i)
    // const newLevels = [...levels.slice(0, i), ...levels.slice(i + 1)]
    if (isSafeLine(newLevels)) {
      return true
    }
  }

  return false
}

async function main() {
  const url = 'https://adventofcode.com/2024/day/2/input'
  const inputData = await getInputData(url)

  const lines = inputData.split('\n')
  console.log('lines', lines)
  // Use reduce for a functional style counting
  const safeCount = lines.reduce((count, line) => {
    const levels = line.split(' ').map(Number)
    return isSafeWithDampener(levels) ? count + 1 : count
  }, 0)

  console.log('safeCount', safeCount)
}

main().catch(console.error)
