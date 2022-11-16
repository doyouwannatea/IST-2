import { twoPointMutate } from "./genetic-algorithms/mutate";
import { onePointCrossoverOnPopulation } from "./genetic-algorithms/сrossover";
import { Child } from "./models/child";
import { shuffleArray } from "./utils/array";
import { createChart, createChartDataFromChild } from "./utils/chart";
import { randomInt, strip } from "./utils/number";

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
    const index = randomInt(0, initialChild.length - 1);
    child.push(initialChild[index]);
  }
  return child;
}

function createInitialPopulation(count: number): Child[] {
  return new Array(count).fill(undefined).map(createChild);
}

async function start() {
  const loadingEl: HTMLDivElement | null = document.querySelector(".loading");

  const chartFitness = createChartDataFromChild(fitness);
  createChart(chartFitness);

  // default population
  const population = createInitialPopulation(20);

  const count = 1;
  let newPopulation: Child[] = [];
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => {
      // Shuffle
      newPopulation = shuffleArray(population);
      // Crossover
      newPopulation = onePointCrossoverOnPopulation(newPopulation);
      // Mutate
      newPopulation = newPopulation.map(twoPointMutate);
      // Delete the half
      const fitness = newPopulation
        .map((child, index) => ({ value: calcFitness(child), index }))
        .sort((a, b) => a.value - b.value)
        .slice(0, newPopulation.length / 2);

      const greatPopulation = newPopulation.filter((_, index) =>
        fitness.find((fit) => fit.index === index)
      );

      newPopulation = greatPopulation;

      console.log(fitness[0].value);
      resolve(undefined);
    });
    console.log(i + 1);
    console.log("\n");
  }

  if (loadingEl) loadingEl.style.display = "none";
  createChart(createChartDataFromChild(newPopulation.map(calcFitness)));
}

document.addEventListener("DOMContentLoaded", () => setTimeout(start, 200));
