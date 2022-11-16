export function strip(num: number): number {
  return Number(parseFloat(String(num)).toPrecision(12));
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
