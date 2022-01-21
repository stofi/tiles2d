type numberOrTupleOrVector2 = number | [number, number] | Vector2

export default class Vector2 {
  public x: number
  public y: number
  constructor(x: numberOrTupleOrVector2, y?: number) {
    if (typeof x === 'number') {
      this.x = x
      this.y = y ?? x
    } else if (Array.isArray(x)) {
      this.x = x[0]
      this.y = x[1]
    } else {
      this.x = x.x
      this.y = x.y
    }
  }
  public add(vector: Vector2): Vector2 {
    return new Vector2([this.x + vector.x, this.y + vector.y])
  }
  public subtract(vector: Vector2): Vector2 {
    return new Vector2([this.x - vector.x, this.y - vector.y])
  }
  public multiply(vector: Vector2): Vector2 {
    return new Vector2([this.x * vector.x, this.y * vector.y])
  }
  public divide(vector: Vector2): Vector2 {
    return new Vector2([this.x / vector.x, this.y / vector.y])
  }
  public scale(scalar: number): Vector2 {
    return new Vector2([this.x * scalar, this.y * scalar])
  }
  public magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  public normalize(): Vector2 {
    return this.divide(new Vector2(this.magnitude()))
  }
  public dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y
  }
  public angle(vector: Vector2): number {
    return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()))
  }
  public toArray(): [number, number] {
    return [this.x, this.y]
  }
  public toString(): string {
    return `[${this.x}, ${this.y}]`
  }
}
