import Vector2 from './vector'
import SimplexNoise from 'simplex-noise'

interface Sample {
  position: Vector2
  value: number
}
type OptionalSample = Sample | undefined

class MarchingSquares {
  // # Properites
  // ## Private properties
  private size: Vector2
  private noise: SimplexNoise = new SimplexNoise()
  private samples: Sample[] = []
  private dualSamples: Sample[] = []

  // ### Internal properties
  private samplesInitialized = false
  private generated = false

  // ## Computed properties
  private get centerPosition(): Vector2 {
    return new Vector2(this.size.x / 2, this.size.y / 2)
  }
  public get variants(): Sample[] {
    if (!this.generated) throw new Error('MarchingSquares not generated')
    return this.dualSamples
  }
  public noiseScale: number = 1

  /* constructor
   * @param size: Vector2
   * @param tileSize: Vector2
   * @description Initializes the generator
   * @returns Marching
   */
  constructor(size: Vector2) {
    this.size = size
  }

  // # Methods
  // ## Private methods
  // ### Utilities

  /* getNeighbours
   * @param position: Vector2
   * @description Returns an array of neigbouring samples starting with self in top left, going clockwise
   * @returns OptionalSample[]
   */
  private getNeighbours(position: Vector2): OptionalSample[] {
    const index = this.positionToIndex(position)
    const isLastInRow = position.x === this.size.x - 1
    const isLastInColumn = position.y === this.size.y - 1
    // array of neigbouring samples starting with self in top left, going clockwise
    const neighbours = [
      this.samples[index],
      isLastInRow ? undefined : this.samples[index + 1],
      isLastInColumn || isLastInRow
        ? undefined
        : this.samples[index + this.size.x + 1],
      isLastInColumn ? undefined : this.samples[index + this.size.x],
    ]

    return neighbours
  }

  /* positionToIndex
   * @param position: Vector2
   * @description Returns the index of the sample at the given position
   * @returns number
   * @throws Error
   */
  private positionToIndex(position: Vector2): number {
    if (
      position.x < 0 ||
      position.x >= this.size.x ||
      position.y < 0 ||
      position.y >= this.size.y
    ) {
      throw new Error('Position out of bounds')
    }
    return position.x + position.y * this.size.x
  }

  /* indexToPosition
   * @param index: number
   * @description Returns the position of the sample at the given index
   * @returns Vector2
   * @throws Error
   */
  private indexToPosition(index: number): Vector2 {
    if (index < 0 || index >= this.size.x * this.size.y) {
      throw new Error('Index out of bounds')
    }

    return new Vector2(index % this.size.x, Math.floor(index / this.size.x))
  }

  // ### Initializers

  /* initializeSamples
   * @description Initializes the samples
   */
  private initializeSamples() {
    this.samples = new Array(this.size.x * this.size.y).fill(0).map(
      (_, i) =>
        ({
          position: this.indexToPosition(i),
          value: i,
        } as Sample)
    )
    this.dualSamples = new Array(this.size.x * this.size.y).fill(0).map(
      (_, i) =>
        ({
          position: this.indexToPosition(i),
          value: i,
        } as Sample)
    )
    this.samplesInitialized = true
  }

  /* generateNoise
   * @description Generates the noise
   */
  private generateNoise() {
    this.noise = new SimplexNoise()
  }

  /* getDualVariant
   * @param position: Vector2
   * @description Returns the dual variant of the sample at the given position
   * @returns number
   */
  private getDualVariant(position: Vector2): number {
    let variant = 0b0000
    const neighboursValues = this.getNeighbours(position).map((n) =>
      n && n.value > 0.5 ? 1 : 0
    )
    if (neighboursValues[0] === 1) variant |= 0b0001
    if (neighboursValues[1] === 1) variant |= 0b0010
    if (neighboursValues[2] === 1) variant |= 0b0100
    if (neighboursValues[3] === 1) variant |= 0b1000
    return variant
  }

  /* getNoise
   * @param position: Vector2
   * @returns number
   * @description Returns the noise value at the given position
   */
  private getNoise(position: Vector2): number {
    const transformedPosition = position
      .subtract(this.centerPosition)
      .scale(this.noiseScale)
    const noiseValue =
      (1 + this.noise.noise2D(transformedPosition.x, transformedPosition.y)) / 2
    return noiseValue
  }

  /* populateDualSamples
   * @description Populates the dual samples
   */
  private populateSamples() {
    if (!this.samplesInitialized) throw new Error('Samples not initialized')
    this.samples.forEach((sample) => {
      sample.value = this.getNoise(sample.position)
      sample.position = sample.position.add(new Vector2(-0.5))
    })
  }

  /* populateDualSamples
   * @description Populates the dual samples
   */
  private populateDualSamples() {
    if (!this.samplesInitialized) throw new Error('Samples not initialized')
    this.dualSamples.forEach((sample) => {
      sample.value = this.getDualVariant(sample.position)
    })
  }

  // ## Public methods

  /* generate
   * @description Generates the marching squares
   */
  public generate() {
    this.initializeSamples()
    this.generateNoise()
    this.populateSamples()
    this.populateDualSamples()
    this.generated = true
  }
}

export default MarchingSquares
