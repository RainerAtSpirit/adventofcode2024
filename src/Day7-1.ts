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

function generateOperatorCombinations(n: number): string[][] {
  if (n === 0) return [[]];
  const smallerCombos = generateOperatorCombinations(n - 1);
  return [
    ...smallerCombos.map(combo => [...combo, '+']),
    ...smallerCombos.map(combo => [...combo, '*']),
  ];
}

function evaluateExpression(numbers: number[], operators: string[]): number {
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    if (operator === '+') {
      result += numbers[i + 1];
    } else if (operator === '*') {
      result *= numbers[i + 1];
    }
  }
  return result;
}

function isEquationValid(target: number, numbers: number[]): boolean {
  const operatorCombinations = generateOperatorCombinations(numbers.length - 1);
  for (const operators of operatorCombinations) {
    if (evaluateExpression(numbers, operators) === target) {
      return true; // At least one configuration works
    }
  }
  return false;
}

function solveBridgeRepair(input: string): number {
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

console.log('Calibration Result:', solveBridgeRepair(exampleInput)); // Should output 3749



async function main() {
  const url = 'https://adventofcode.com/2024/day/7/input'
  const inputData = await getInputData(url)

  const result = solveBridgeRepair(inputData)
  console.log(result)

 
}

main().catch(console.error)
