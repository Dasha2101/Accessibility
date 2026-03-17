export const createTimeChecker = (limitMs: number) => {
  const startTime = Date.now();

  return () => Date.now() - startTime > limitMs;
};
