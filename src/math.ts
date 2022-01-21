
const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(Math.max(value, min), max)

const map = (
  value: number,
  min: number,
  max: number,
  toMin: number,
  toMax: number
): number => toMin + ((value - min) * (toMax - toMin)) / (max - min)

export {
  clamp,
  map,
}