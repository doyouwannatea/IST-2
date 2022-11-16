import { Child } from "../models/child";
import { shuffleArray } from "../utils/array";
import { randomInt } from "../utils/number";

export function onePointCrossover(
  parentA: Child,
  parentB: Child,
  point: number
): [Child, Child] {
  if (parentA.length !== parentB.length)
    throw new Error("parentA.length !== parentB.length");
  if (point > parentA.length) throw new Error("point > parentA.length");
  if (point < 1) throw new Error("point < 0");

  const parentALeft = parentA.slice(0, point - 1);
  const parentARight = parentA.slice(point - 1);
  const parentBLeft = parentB.slice(0, point - 1);
  const parentBRight = parentB.slice(point - 1);

  return [
    [...parentALeft, ...parentBRight],
    [...parentBLeft, ...parentARight],
  ];
}

export function onePointCrossoverOnPopulation(population: Child[]): Child[] {
  const newPopulation: Child[] = [];
  const indexList = shuffleArray(
    new Array(population.length).fill(undefined).map((_, index) => index)
  );

  for (let i = 0; i < indexList.length; i += 2) {
    newPopulation.push(
      ...onePointCrossover(
        population[indexList[i]],
        population[indexList[i + 1]],
        randomInt(1, population[0].length)
      )
    );
  }

  return [...population, ...newPopulation];
}
