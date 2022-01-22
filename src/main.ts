import './style.css'

import Vector2 from './vector'
import { Tileset, Tile } from './tileset'
import CanvasController from './canvas'
import MarchingSquares from './marching-squares'

import { Drawable } from './canvas'
import Rectangle from './rectangle'

const CONSTANTS = {
  tileSize: 50,
  gridSize: new Vector2(20, 20),
}

// # DOM
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const imageElement = document.getElementById('tileset') as HTMLImageElement
const image = new Image()

// # Objects
const cc = new CanvasController(canvas, window.innerWidth, window.innerHeight)
const ms = new MarchingSquares(CONSTANTS.gridSize)

// # Variables
let ts: Tileset
let tileVariants: Tile[] = []

// # Functions
const main = () => {
  ms.noiseScale = 0.1
  ms.generate()
  const variants = ms.variants
  const tiles = variants.map(({ position, value: variant }) => {
    const tile = tileVariants[variant].clone()
    tile.setPosition(position.scale(CONSTANTS.tileSize))
    tile.scale = new Vector2(CONSTANTS.tileSize / 32)
    return tile
  })
  const debug = ms.samples.map(({ position, value }): Drawable => {
    return {
      draw: (ctx: CanvasRenderingContext2D) => {
        // print position and value
        ctx.fillStyle = 'black'
        ctx.font = '10px Arial'
        ctx.fillText(
          `${(10* value -5).toFixed(2)}`,
          position.x * CONSTANTS.tileSize + 2,
          position.y * CONSTANTS.tileSize + CONSTANTS.tileSize * 0.25
        )
        // // print position
        // ctx.fillStyle = 'blue'
        // // set font size to 10px
        // ctx.font = '8px Arial'
        // ctx.fillText(
        //   `${position.x}, ${position.y}`,
        //   position.x * CONSTANTS.tileSize + 12,
        //   position.y * CONSTANTS.tileSize + CONSTANTS.tileSize * 0.25 + 4
        // )
      },
    }
  })

  const noise = ms.samples.map(
    ({ position, value }): Rectangle => {
      const v  = Math.floor(value * 3)
      console.log(v);
      
      return new Rectangle(
        position.scale(CONSTANTS.tileSize),
        new Vector2(CONSTANTS.tileSize),
        `hsla(${v * -120 + 240}, 80%, 80%, .8)`,
        false
      )
    }
  )

  cc.drawAll(tiles)
  // cc.drawAll(debug)
  cc.drawAll(noise)
}

image.src = imageElement.src
image.onload = () => {
  ts = new Tileset(image, new Vector2(32))
  const offset = 50
  tileVariants = [
    ts.tiles[5], // nothing
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
  ]

  main()
  canvas.addEventListener('click', () => {
    cc.clear()
    main()
  })
}
