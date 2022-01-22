import { Drawable } from './canvas'
import Vector2 from './vector'

export class Tile implements Drawable {
  private _image: HTMLImageElement
  private _size: Vector2
  private _position: Vector2
  public position: Vector2
  public scale: Vector2

  constructor(image: HTMLImageElement, position: Vector2, size: Vector2) {
    this._image = image//.cloneNode(true) as HTMLImageElement
    this._position = position
    this._size = size
    this.scale = new Vector2(1)
    this.position = new Vector2(0)
  }

  setPosition(position: Vector2): void {
    this.position = new Vector2(position)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this._image,
      this._position.x,
      this._position.y,
      this._size.x,
      this._size.y,
      this.position.x,
      this.position.y,
      this._size.x * this.scale.x,
      this._size.y * this.scale.y
    )
  }
  clone(): Tile {
    const newTile =  new Tile(this._image, this._position, this._size)
    newTile.position = this.position
    newTile.scale = this.scale
    return newTile
  }
}

export class Tileset {
  private _image: HTMLImageElement
  private _tileSize: Vector2
  private _width: number
  private _height: number
  public tiles: Tile[]

  constructor(image: HTMLImageElement, tileSize: Vector2) {
    this._image = image
    this._tileSize = new Vector2(tileSize)
    this._width = image.width / tileSize.x
    this._height = image.height / tileSize.y
    this.tiles = []
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        // copy image data at tile position
        this.tiles.push(
          new Tile(
            this._image,
            new Vector2(x, y).multiply(this._tileSize),
            this._tileSize
          )
        )
      }
    }
  }
}
