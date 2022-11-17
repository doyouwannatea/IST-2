import { findPopulationFitness, fitnessToPopulation } from "../fitness";
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
    throw new Error(`point = ${point}, but must be <= ${parentA.length - 2}`);
  if (point < 0) throw new Error(`point = ${point}, but must be >= 0`);

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
  const children: Child[] = [];
  const fitness = findPopulationFitness(population);
  // Находим 5 лучших представителей популяции
  const bestPopulationMembers = fitnessToPopulation(
    population,
    fitness.slice(0, 5)
  );
  // Остальные представители популяции
  const restPopulation = fitnessToPopulation(
    population,
    shuffleArray(fitness.slice(bestPopulationMembers.length))
  );

  // Скрещивание лучших представителей со случайными из оставшейся популяции
  for (let i = 0; i < bestPopulationMembers.length; i++) {
    children.push(
      ...onePointCrossover(
        bestPopulationMembers[i],
        restPopulation[i],
        randomInt(0, population[0].length - 1)
      )
    );
  }

  // Скрещивание оставшихся представителей популяции
  for (
    let i = bestPopulationMembers.length;
    i < restPopulation.length - 1;
    i += 2
  ) {
    children.push(
      ...onePointCrossover(
        restPopulation[i],
        restPopulation[i + 1],
        randomInt(0, population[0].length - 1)
      )
    );
  }

  return children;
}
