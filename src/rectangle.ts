import Vector2 from './vector'
import { Drawable } from './canvas'

export default class Rectangle implements Drawable {
  public position: Vector2
  public size: Vector2
  public color: string
  public onlyOutline: boolean
  constructor(
    position: Vector2,
    size: Vector2,
    color: string,
    onlyOutline?: boolean
  ) {
    this.position = position
    this.size = size
    this.color = color
    this.onlyOutline = onlyOutline ?? false
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.onlyOutline) {
      ctx.strokeStyle = this.color
      ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y)
    } else {
      ctx.fillStyle = this.color
      ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    }
  }
}
