export function timeout(cb: () => void, timeout: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      cb();
      resolve(undefined);
    }, timeout)
  );
}
