import { getInputData } from "./utils/getInputData";

function parseInput(input: string): { target: number; numbers: number[] }[] {
  return input.trim().split('\n').map(line => {
    const [target, nums] = line.split(':');
    return {
      target: parseInt(target.trim(), 10),
      numbers: nums.trim().split(' ').map(Number),
    };
  });
}

const memo = new Map<string, boolean>();

function evaluateExpression(numbers: number[], operators: string[]): number {
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    if (operator === '+') {
      result += numbers[i + 1];
    } else if (operator === '*') {
      result *= numbers[i + 1];
    } else if (operator === '||') {
      result = parseInt(result.toString() + numbers[i + 1].toString(), 10);
    }
  }
  return result;
}

function generateOperatorCombinations(n: number): string[][] {
  if (n === 0) return [[]];
  const smallerCombos = generateOperatorCombinations(n - 1);
  return [
    ...smallerCombos.map(combo => [...combo, '+']),
    ...smallerCombos.map(combo => [...combo, '*']),
    ...smallerCombos.map(combo => [...combo, '||']),
  ];
}

function isEquationValid(target: number, numbers: number[]): boolean {
  const key = `${target}|${numbers.join(',')}`;
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  const operatorCombinations = generateOperatorCombinations(numbers.length - 1);
  for (const operators of operatorCombinations) {
    if (evaluateExpression(numbers, operators) === target) {
      memo.set(key, true); // Cache valid result
      return true;
    }
  }

  memo.set(key, false); // Cache invalid result
  return false;
}

function solveBridgeRepairPart2(input: string): number {
  const equations = parseInput(input);

  const validEquations = equations.filter(({ target, numbers }) =>
    isEquationValid(target, numbers)
  );

  return validEquations.reduce((sum, { target }) => sum + target, 0);
}

// Example Input
const exampleInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim();

console.log('Calibration Result Part 2:', solveBridgeRepairPart2(exampleInput)); // Should output 11387


async function main() {
  const url = 'https://adventofcode.com/2024/day/7/input'
  const inputData = await getInputData(url)

  const result = solveBridgeRepairPart2(inputData)
  console.log(result)

 
}

main().catch(console.error)
