import {
  bestFitChild,
  findPopulationFitness,
  fitnessToPopulation,
} from "./fitness";
import { twoPointMutate } from "./genetic-algorithms/mutate";
import { onePointCrossoverOnPopulation } from "./genetic-algorithms/сrossover";
import { createInitialPopulation } from "./population";
import { shuffleArray } from "./utils/array";
import {
  createBestChildChart,
  createChart,
  createChartDataFromChild,
} from "./utils/chart";
import { timeout } from "./utils/promise";

async function start() {
  const loadingEl: HTMLDivElement | null = document.querySelector(".loading");
  if (loadingEl) loadingEl.style.display = "flex";

  const chartFitness = createChartDataFromChild(bestFitChild);
  createChart(chartFitness);

  // initial population
  let population = createInitialPopulation(
    Number(import.meta.env.VITE_POPULATION_COUNT)
  );
  let populationCount = 1;
  let bestFitness = Number.MAX_SAFE_INTEGER;

  createBestChildChart(population);

  while (
    bestFitness > Number(import.meta.env.VITE_TARGET_FITNESS) &&
    populationCount < Number(import.meta.env.VITE_MAX_POPULATION_COUNT)
  ) {
    await timeout(() => {
      console.log(`Популяция: ${populationCount}`);
      populationCount += 1;
      // Популяция перемешивается
      population = shuffleArray(population);

      // Опреация скрещивания
      population.push(...onePointCrossoverOnPopulation(population));

      // Мутация первой половины популяции
      population = [
        ...population.slice(0, population.length / 2).map(twoPointMutate),
        ...population.slice(population.length / 2),
      ];

      // Удаляем худшую половину популяции
      const fitness = findPopulationFitness(population).slice(
        0,
        population.length / 2
      );
      population = fitnessToPopulation(population, fitness);

      // Находим евклидово расстояние лучшего представителя популяции
      bestFitness = fitness[0].value;

      console.log(population);
      console.log(fitness);
      console.log(bestFitness);
      console.log("—————————————————————————");
    }, 10);
  }

  createBestChildChart(population);
  if (loadingEl) loadingEl.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => setTimeout(start, 200));
