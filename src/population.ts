import { Y } from "./fitness";
import { Child } from "./models/child";
import { randomFloat, strip } from "./utils/number";

export const initialChild = createInitialChild(0.1, 10, 0.1);

export function createChild(): Child {
  const child: Child = [];
  for (let i = 0; i < initialChild.length; i++) {
    child.push(Y(Number(randomFloat(0.1, 10).toFixed(1))));
  }
  return child;
}

export function createInitialPopulation(count: number): Child[] {
  return new Array(count).fill(undefined).map(createChild);
}

export function createInitialChild(
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
