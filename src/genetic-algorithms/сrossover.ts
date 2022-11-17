import { findPopulationFitness, fitnessToPopulation } from "../main";
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
  if (point > parentA.length - 2)
    throw new Error(`Point = ${point}, but must be <= ${parentA.length - 2}`);
  if (point < 0) throw new Error(`Point = ${point}, but must be >= 0`);

  const parentALeft = parentA.slice(0, point + 1);
  const parentARight = parentA.slice(point + 1);
  const parentBLeft = parentB.slice(0, point + 1);
  const parentBRight = parentB.slice(point + 1);

  return [
    [...parentALeft, ...parentBRight],
    [...parentBLeft, ...parentARight],
  ];
}

export function onePointCrossoverOnPopulation(population: Child[]): Child[] {
  const newPopulation: Child[] = [];
  const fitness = findPopulationFitness(population);
  const bestChildren = fitnessToPopulation(population, fitness.slice(0, 5));
  const restPopulation = fitnessToPopulation(
    population,
    shuffleArray(fitness.slice(bestChildren.length))
  );

  for (let i = 0; i < bestChildren.length; i++) {
    newPopulation.push(
      ...onePointCrossover(
        bestChildren[i],
        restPopulation[i],
        randomInt(0, population[0].length - 1)
      )
    );
  }

  for (let i = bestChildren.length; i < restPopulation.length - 1; i += 2) {
    newPopulation.push(
      ...onePointCrossover(
        restPopulation[i],
        restPopulation[i + 1],
        randomInt(0, population[0].length - 1)
      )
    );
  }

  return newPopulation;
}
