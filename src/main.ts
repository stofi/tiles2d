import './style.css'
import { clamp, map } from './math'

import Vector2 from './vector'
import generatePerlinNoise from './perlin'
import { PerlinNoiseOptions } from './perlin'
import { Tileset, Tile } from './tileset'

import CanvasController from './canvas'
import Rectangle from './rectangle'

interface Sample {
  position: Vector2
  value: number
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const cc = new CanvasController(canvas, window.innerWidth, window.innerHeight)
const centerPosition = new Vector2(cc.width / 2, cc.height / 2)

const main = () => {
  cc.draw(new Rectangle(new Vector2(0), new Vector2(cc.width, cc.height), '#559bfa'))
  const perlinCellSize = 20
  const sampleCellSize = 100

  // options for perlin noise, with values between 0 and 1
  const options: PerlinNoiseOptions = {
    width: Math.floor(cc.width / perlinCellSize),
    height: Math.floor(cc.height / perlinCellSize),
    seed: Math.random(),
    octaves: 4,
    persistence: 1,
    lacunarity: 2,
    frequency: 0.01,
    amplitude: 0.5,
    offset: 50,
    scale: 100,
  }
  const perlinNoise = generatePerlinNoise(options)

  const getNoiseValue = (position: Vector2, noise: number[]): number => {
    const x = Math.floor(position.x / perlinCellSize)
    const y = Math.floor(position.y / perlinCellSize)
    return noise[y * options.width + x]
  }

  // 2d grid of samples from perlin noise
  let samplesWidth = Math.floor(cc.width / sampleCellSize) + 1
  let samplesHeight = Math.floor(cc.height / sampleCellSize) + 1
  let samples: Sample[] = new Array(samplesWidth * samplesHeight)
    .fill(0)
    .map((_, i) => {
      const x = i % samplesWidth
      const y = Math.floor(i / samplesWidth)
      const position = new Vector2(x, y).scale(sampleCellSize)
      const sample: Sample = {
        position,
        value: getNoiseValue(position, perlinNoise),
      }
      return sample
    })

  samples = samples.map((sample) => {
    // multiply samples by distance from center
    const positionFromCenter = sample.position.subtract(centerPosition)

    const normalizedDistance = positionFromCenter
      .divide(new Vector2(cc.width, cc.height))
      .scale(2)
      .magnitude()
    const invertedDistance = clamp(map(normalizedDistance, 0, 1, 1, 0))
    // return {...sample, value: normalizedDistance}
    const normalValue = sample.value / 100
    const powerValue = Math.pow(normalValue, 2)
    const value = powerValue * invertedDistance > 0.4 ? 1 : 0
    return { ...sample, value }
  })

  // draw rectangles for each sample
  const rectangles: Rectangle[] = []
  const samplePoints: Rectangle[] = []
  samples.forEach((sample, index, arr) => {
    const color = `hsl(${(index / arr.length) * 130}, 90%, ${
      sample.value === 0 ? 50 : 100
    }%)`
    // const color = `hsl(${sample.value * 360}, 100%, 50%)`
    const rectangle = new Rectangle(
      sample.position.subtract(
        new Vector2(sampleCellSize / 2, sampleCellSize / 2)
      ),
      new Vector2(sampleCellSize),
      color
    )
    rectangles.push(rectangle)
    const samplePoint = new Rectangle(
      sample.position.subtract(new Vector2(1)),
      new Vector2(2),
      sample.value === 0 ? 'red' : 'pink'
    )
    samplePoints.push(samplePoint)
  })
  console.log(samplesWidth);
  

  const dual = samples.map((sample, i) => {
    let variant = 0b0000
    const isLastInRow = i % samplesWidth === 0
    const isLastInColumn = i > samples.length - samplesWidth
    const neighbours = [
      samples[i],
      isLastInRow ? undefined : samples[i + 1],
      isLastInColumn || isLastInRow ? undefined : samples[i + samplesWidth+1],
      isLastInColumn ? undefined : samples[i + samplesWidth ],
    ].map((n) => (n ? n.value : 0))
    if (neighbours[0] === 1) variant |= 0b0001
    if (neighbours[1] === 1) variant |= 0b0010
    if (neighbours[2] === 1) variant |= 0b0100
    if (neighbours[3] === 1) variant |= 0b1000
    return {
      ...sample,
      value: variant,
    }
  })

  const variants = dual.map((sample,index) => ({
    draw(ctx: CanvasRenderingContext2D) {
      // draw variant number text
      ctx.fillStyle = '#000'
      ctx.font = '9px monospaced'
      ctx.fillText(
        `${index.toFixed(0)}:${sample.value.toFixed(0)}`,
        sample.position.x,
        sample.position.y + 9
      )
    },
  }))

  const dualPoints = dual.map((sample) => {
    const rectangle = new Rectangle(
      sample.position,
      new Vector2(sampleCellSize),
      'blue',
      true
    )
    return rectangle
  })
  const mappedTiles = ts.tiles.length
    ? dual.map((sample) => {
        const tileIndex = sample.value
        const mappedIndex = tileIndex
        const tile = tileVariants[mappedIndex].clone()
        tile.scale = new Vector2(sampleCellSize / 32)
        tile.position = sample.position
        return tile
      })
    : []

  // cc.drawAll(rectangles)
  // cc.drawAll(dualPoints)
  // cc.drawAll(samplePoints)
  cc.drawAll(mappedTiles)
  // cc.drawAll(variants)
}

const image = new Image()
image.src = './assets/tileset.png'
let ts: Tileset

let tileVariants: Tile[] = []

image.onload = () => {
  ts = new Tileset(image, new Vector2(32))
  tileVariants = [
    ts.tiles[5].clone(), // nothing
    ts.tiles[82].clone(), // land up left
    ts.tiles[80].clone(), // land up right
    ts.tiles[81].clone(), // water down
    ts.tiles[50].clone(), // land right down
    ts.tiles[83].clone(), // land up left and right down
    ts.tiles[65].clone(), // water left
    ts.tiles[54].clone(), // water down left
    ts.tiles[52].clone(), // land down left
    ts.tiles[67].clone(), // water right
    ts.tiles[84].clone(), 
    ts.tiles[53].clone(), // water down right
    ts.tiles[51].clone(), // water up
    ts.tiles[68].clone(), // water up right
    ts.tiles[69].clone(), // water up left
    ts.tiles[66].clone(), // dirt
  ]

  main()
  canvas.addEventListener('click', () => {
    cc.clear()
    main()
  })
}
