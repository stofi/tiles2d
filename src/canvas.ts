export interface CanvasControllerInterface {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  setSize(width: number, height: number): void
  clear(): void
  draw(drawable: Drawable): void
  drawAll(drawables: Drawable[]): void
}

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void
}

export default class CanvasController implements CanvasControllerInterface {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width = 0
  height = 0
  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    if (!canvas) throw new Error('CanvasController: canvas is not defined')
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) throw new Error('CanvasController: context is not defined')
    this.ctx = context
    this.setSize(width, height)
  }
  setSize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height
  }
  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
  draw(drawable: Drawable): void {
    drawable.draw(this.ctx)
  }
  drawAll(drawables: Drawable[]): void {
    for (let drawable of drawables) {
      drawable.draw(this.ctx)
    }
  }
}
