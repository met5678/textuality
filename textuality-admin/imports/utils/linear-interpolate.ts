export const linearInterpolate = (
  start: number,
  end: number,
  progress: number,
) => {
  return start + (end - start) * progress;
};
