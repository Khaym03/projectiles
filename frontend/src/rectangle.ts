import { Vector } from './vector'
import { Circle } from './circle'
import { EasingFunction } from './lib/utils'

export class Rectangle {
  isCollidingWithTarget = false

  private startPosition: Vector
  // public targetPosition: Vector
  private startTime: number

  constructor(
    private ctx: CanvasRenderingContext2D,
    private position: Vector,
    public targetPosition: Vector,
    private width: number,
    private height: number,
    private duration: number, // Duración del movimiento
    public easeFunc: EasingFunction
  ) {
    this.startPosition = new Vector(position.x, position.y)

    this.startTime = performance.now() // Guarda el tiempo inicial
  }

  update() {
    const currentTime = performance.now()
    const elapsedTime = currentTime - this.startTime

    if (elapsedTime < this.duration) {
      const t = elapsedTime / this.duration // Normaliza el tiempo entre 0 y 1
      const easedT = this.easeFunc(t) // Aplica la función de easing

      // Interpolación entre la posición inicial y la posición objetivo usando easing
      this.position.x =
        this.startPosition.x +
        (this.targetPosition.x - this.startPosition.x) * easedT

      this.position.y =
        this.startPosition.y +
        (this.targetPosition.y - this.startPosition.y) * easedT
    } else {
      // Si ha llegado al final, ajusta la posición a la posición objetivo
      this.position = new Vector(this.targetPosition.x, this.targetPosition.y)
    }
  }

  draw() {
    this.ctx.save()

    this.ctx.fillStyle = this.isCollidingWithTarget ? 'red' : '#fff'

    this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    this.ctx.restore()
  }

  checkCollision(circle: Circle): boolean {
    // Encuentra el punto más cercano en el rectángulo al centro del círculo
    const closestX = Math.max(
      this.position.x,
      Math.min(circle.position.x, this.position.x + this.width)
    )
    const closestY = Math.max(
      this.position.y,
      Math.min(circle.position.y, this.position.y + this.height)
    )

    // Calcula la distancia entre el círculo y este punto más cercano
    const distanceX = circle.position.x - closestX
    const distanceY = circle.position.y - closestY

    // Calcula la distancia al cuadrado (sin necesidad de usar sqrt)
    const distanceSquared = distanceX * distanceX + distanceY * distanceY

    // Compara con el cuadrado del radio del círculo
    this.isCollidingWithTarget = distanceSquared < circle.radius * circle.radius

    return this.isCollidingWithTarget
  }

  area(): number {
    return this.width * this.height
  }
}
