import { Child, ChildFit } from "./models/child";
import { initialChild } from "./population";

// Y = sin(2x)
export function Y(x: number): number {
  return Math.sin(x * 2);
}

export const bestFitChild = initialChild.map(Y);

export function euclidDistance(a: Child, b: Child): number {
  return (
    a
      .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
      .reduce((sum, now) => sum + now) ** // sum
    (1 / 2)
  );
}

export function calcFitness(child: Child): number {
  return euclidDistance(child, bestFitChild);
}

export function fitnessToPopulation(
  population: Child[],
  fitness: ChildFit[]
): Child[] {
  return population.filter((_, index) =>
    fitness.find((fit) => fit.index === index)
  );
}

export function findPopulationFitness(population: Child[]): ChildFit[] {
  return [...population]
    .map((child, index) => ({ value: calcFitness(child), index }))
    .sort((a, b) => a.value - b.value);
}
