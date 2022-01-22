import './style.css'

import Vector2 from './vector'
import { Tileset, Tile } from './tileset'
import CanvasController from './canvas'
import MarchingSquares from './marching-squares'

// import { Drawable } from './canvas'
// import Rectangle from './rectangle'

const CONSTANTS = {
  tileSize: 16,
  gridSize: new Vector2(60, 60),
}

// # DOM
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const imageElement = document.getElementById('tileset') as HTMLImageElement
const image = new Image()

// # Objects
const cc = new CanvasController(canvas, window.innerWidth, window.innerHeight)
const ms = new MarchingSquares(CONSTANTS.gridSize, 3)

// # Variables
let ts: Tileset
let tileVariants: Tile[][] = []

// # Functions
const main = () => {
  ms.noiseScale = 0.05
  ms.generate()
  const variants = ms.variants
  const tiles = variants.map(({ position, value: variant }) => {
    const variantIndex = variant % tileVariants[0].length
    // get fifth bit of variant
    const variant5 = (variant & 0b00010000) >> 4

    const tile = tileVariants[variant5][variantIndex].clone()
    tile.setPosition(position.scale(CONSTANTS.tileSize))
    tile.scale = new Vector2(CONSTANTS.tileSize / 32)
    return tile
  })
  // const debug = variants.map(({ position, value }): Drawable => {
  //   return {
  //     draw: (ctx: CanvasRenderingContext2D) => {
  //       // print position and value
  //       const value5 = (value & 0b00010000) >> 4
  //       const variantIndex = value % tileVariants[0].length
  //       ctx.fillStyle = 'black'
  //       ctx.font = '10px Arial'
  //       ctx.fillText(
  //         `${value5}: ${variantIndex}`,
  //         position.x * CONSTANTS.tileSize + 2,
  //         position.y * CONSTANTS.tileSize + CONSTANTS.tileSize * 0.25
  //       )
  //     },
  //   }
  // })

  // const noise = ms.samples.map(({ position, value }): Rectangle => {
  //   const v = Math.round(value / 3 * 255)
  //   console.log(v)

  //   return new Rectangle(
  //     position.scale(CONSTANTS.tileSize),
  //     new Vector2(CONSTANTS.tileSize),
  //     `rgba(${v}, ${v}, ${v}, 1)`,
  //     true
  //   )
  // })

  cc.drawAll(tiles)
  // cc.drawAll(debug)
  // cc.drawAll(noise)
}

image.src = imageElement.src
image.onload = () => {
  
  ts = new Tileset(image, new Vector2(32))
  let offset = 50
  tileVariants = []
  tileVariants.push([
    // ts.tiles[30], // grass
    ts.tiles[31], // water
    ts.tiles[offset + 32], // land up left
    ts.tiles[offset + 30], // land up right
    ts.tiles[offset + 31], // water down
    ts.tiles[offset], // land right down
    ts.tiles[offset + 33], // land up left and right down
    ts.tiles[offset + 15], // water left
    ts.tiles[offset + 4], // water down left
    ts.tiles[offset + 2], // land down left
    ts.tiles[offset + 17], // water right
    ts.tiles[offset + 34],
    ts.tiles[offset + 3], // water down right
    ts.tiles[offset + 1], // water up
    ts.tiles[offset + 18], // water up right
    ts.tiles[offset + 19], // water up left
    ts.tiles[30], // dirt
  ])
  offset -= 5
  tileVariants.push(
    [
      ts.tiles[32], // dirt
      ts.tiles[offset + 32], // land up left
      ts.tiles[offset + 30], // land up right
      ts.tiles[offset + 31], // water down
      ts.tiles[offset], // land right down
      ts.tiles[offset + 33], // land up left and right down
      ts.tiles[offset + 15], // water left
      ts.tiles[offset + 4], // water down left
      ts.tiles[offset + 2], // land down left
      ts.tiles[offset + 17], // water right
      ts.tiles[offset + 34],
      ts.tiles[offset + 3], // water down right
      ts.tiles[offset + 1], // water up
      ts.tiles[offset + 18], // water up right
      ts.tiles[offset + 19], // water up left
      ts.tiles[offset + 16], // dirt
    ].reverse()
  )

  main()
  canvas.addEventListener('click', () => {
    cc.clear()
    main()
  })
}
