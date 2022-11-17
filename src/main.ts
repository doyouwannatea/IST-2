import { twoPointMutate } from "./genetic-algorithms/mutate";
import { onePointCrossoverOnPopulation } from "./genetic-algorithms/сrossover";
import { Child, ChildFit } from "./models/child";
import { shuffleArray } from "./utils/array";
import { createChart, createChartDataFromChild } from "./utils/chart";
import { randomFloat, strip } from "./utils/number";

// Y = sin(2x)
function Y(x: number): number {
  return Math.sin(x * 2);
}

const initialChild = createInitialChild(0.1, 10, 0.1);
const fitness = initialChild.map(Y);

function euclidDistance(a: Child, b: Child): number {
  return (
    a
      .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
      .reduce((sum, now) => sum + now) ** // sum
    (1 / 2)
  );
}

function calcFitness(child: Child): number {
  return euclidDistance(child, fitness);
}

export function findPopulationFitness(population: Child[]): ChildFit[] {
  return [...population]
    .map((child, index) => ({ value: calcFitness(child), index }))
    .sort((a, b) => a.value - b.value);
}

function createInitialChild(
  start: number,
  end: number,
  interval: number
): Child {
  const child = [];
  for (let i = start; i <= end; i = strip(i + interval)) {
    child.push(i);
  }
  return child;
}

function createChild(): Child {
  const child: Child = [];
  for (let i = 0; i < initialChild.length; i++) {
    child.push(Y(Number(randomFloat(0.1, 10).toFixed(1))));
  }
  return child;
}

function createInitialPopulation(count: number): Child[] {
  return new Array(count).fill(undefined).map(createChild);
}

export function fitnessToPopulation(
  population: Child[],
  fitness: ChildFit[]
): Child[] {
  return population.filter((_, index) =>
    fitness.find((fit) => fit.index === index)
  );
}

function timeout(cb: () => void, timeout: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      cb();
      resolve(undefined);
    }, timeout)
  );
}

function createBestChildChart(population: Child[]) {
  const bestChild = population[findPopulationFitness(population)[0].index];
  createChart(createChartDataFromChild(bestChild));
}

async function start() {
  const loadingEl: HTMLDivElement | null = document.querySelector(".loading");
  if (loadingEl) loadingEl.style.display = "flex";

  const chartFitness = createChartDataFromChild(fitness);
  createChart(chartFitness);

  // initial population
  let population = createInitialPopulation(20);
  let populationCount = 1;
  let bestFitness = Number.MAX_SAFE_INTEGER;

  createBestChildChart(population);

  while (bestFitness > 0.5 && populationCount < 10000) {
    await timeout(() => {
      console.log(`Популяция: ${populationCount}`);
      populationCount += 1;
      // Shuffle
      population = shuffleArray(population);

      // Crossover
      population.push(...onePointCrossoverOnPopulation(population));

      // Mutate
      population = [
        ...population.slice(0, population.length / 2).map(twoPointMutate),
        ...population.slice(population.length / 2),
      ];

      // Delete the half
      const fitness = findPopulationFitness(population).slice(
        0,
        population.length / 2
      );
      population = fitnessToPopulation(population, fitness);
      bestFitness = fitness[0].value;

      console.log(fitness);
      console.log(bestFitness);
      console.log("—————————————————————————");
    }, 10);
  }

  createBestChildChart(population);
  if (loadingEl) loadingEl.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => setTimeout(start, 200));
