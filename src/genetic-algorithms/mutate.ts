import { Child } from "../models/child";
import { randomInt } from "../utils/number";

export function twoPointMutate(child: Child): Child {
  const firstIndex = randomInt(0, child.length - 1);
  const secondIndex = randomInt(0, child.length - 1);
  const firstGen = child[firstIndex];
  child[firstIndex] = child[secondIndex];
  child[secondIndex] = firstGen;
  return child;
}
