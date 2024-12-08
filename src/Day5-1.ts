import { getInputData } from './utils/getInputData'

function parseData(lines: string[]): {
  rules: Array<[number, number]>
  updates: Array<number[]>
} {
  // Find the blank line separator
  let separatorIndex = lines.findIndex((line) => line.trim() === '')
  if (separatorIndex === -1) {
    // If no empty line found, might mean all rules and no updates or incorrect format
    // Handle accordingly. For now, assume we must have at least one empty line.
    throw new Error('No empty line found separating rules and updates.')
  }

  const ruleLines = lines.slice(0, separatorIndex)
  const updateLines = lines.slice(separatorIndex + 1)

  // Parse rules
  const rules: Array<[number, number]> = ruleLines.map((line) => {
    const [X, Y] = line.split('|').map((part) => parseInt(part, 10))
    return [X, Y]
  })

  // Parse updates
  const updates: Array<number[]> = updateLines.map((line) =>
    line.split(',').map((part) => parseInt(part.trim(), 10))
  )

  return { rules, updates }
}

function isUpdateCorrectlyOrdered(
  update: number[],
  rules: Array<[number, number]>
): boolean {
  // Map each page number to its index in the update
  const position: { [page: number]: number } = {}
  update.forEach((page, idx) => {
    position[page] = idx
  })

  // Check each rule
  for (const [X, Y] of rules) {
    // Only consider rule if both X and Y appear in the update
    if (X in position && Y in position) {
      if (position[X] >= position[Y]) {
        return false // The order is violated
      }
    }
  }

  return true
}

function sumMiddlePages(
  rules: Array<[number, number]>,
  updates: Array<number[]>
): number {
  let total = 0

  for (const update of updates) {
    if (isUpdateCorrectlyOrdered(update, rules)) {
      // Update is correct, find the middle page
      const middleIndex = Math.floor(update.length / 2)
      total += update[middleIndex]
    }
  }

  return total
}

// Example usage with your parseData function:

// Assuming you have `lines` read from the input file:
const inputData = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`.split('\n')

const { rules, updates } = parseData(inputData)

const result = sumMiddlePages(rules, updates)
console.log('sample', result)

async function main() {
  const url = 'https://adventofcode.com/2024/day/5/input'
  const inputData = await getInputData(url)

  const lines = inputData.trim().split('\n')
  const { rules, updates } = parseData(lines)

  const result = sumMiddlePages(rules, updates)
  console.log(result)
}

main().catch(console.error)
