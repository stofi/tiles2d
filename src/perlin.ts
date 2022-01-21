import SimplexNoise from 'simplex-noise';

export interface PerlinNoiseOptions {
  width: number
  height: number
  seed?: number
  octaves?: number
  persistence?: number
  lacunarity?: number
  frequency?: number
  amplitude?: number
  offset?: number
  scale?: number
}


const generatePerlinNoise = (options: PerlinNoiseOptions) => {
  const {
    width,
    height,
    seed = Math.random(),
    octaves = 4,
    persistence = 0.5,
    lacunarity = 2.0,
    frequency = 1.0,
    amplitude = 1.0,
    offset = 0.0,
    scale = 1.0
  } = options

  const perlin = new SimplexNoise(seed)
  const noise = new Array(width * height)
  for (let i = 0; i < noise.length; i++) {
    noise[i] = 0
  }

  for (let o = 0; o < octaves; o++) {
    const frequency_ = frequency * Math.pow(lacunarity, o)
    const amplitude_ = amplitude * Math.pow(persistence, o)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x
        const noise_ = perlin.noise2D(x * frequency_, y * frequency_)
        noise[i] += noise_ * amplitude_
      }
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      noise[i] = Math.floor(noise[i] * scale + offset)
    }
  }

  return noise
}

export default generatePerlinNoise