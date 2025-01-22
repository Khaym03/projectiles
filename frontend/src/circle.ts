import { Vector } from './vector'
import { Entity } from './types'
import { CollisionHandler } from './collisions'
import { Friction } from './friction'
import { EARTH_GRAVITY, METER_PER_SECOND } from './constants'
import { Mouse } from './mouse'
import { AirResistance } from './forces/air-resistance'

export class Circle implements Entity {
  public gravity = EARTH_GRAVITY
  public friction = new Friction(0.8)
  public airResistance = new AirResistance()
  public velocityColor = 'green'
  public color = 'hsl(217.2 91.2% 59.8%)'
  public collisionHandler = new CollisionHandler()

  constructor(
    public ctx: CanvasRenderingContext2D,
    private mouse: Mouse,
    public position: Vector,
    public velocity: Vector,
    public radius: number,

    public mass: number
  ) {}

  update() {
    if (this.mouse.getIsDown()) {
      this.drawMouseLine(this.mouse)

      const distance = Vector.distance(this.position, this.mouse.getPosition())

      const magnitude = distance * 0.1
      const angle = Vector.angle(this.position, this.mouse.getPosition())

      const force = Vector.fromPolar(magnitude, angle)

      if (distance > 100) {
        this.velocity = this.velocity.add(force).scale(METER_PER_SECOND)
      }
    }

    if (this.isAtRest() ) {
      this.velocity.x =0
      this.velocity.y = 0
      return
    }

    // Aplicar resistencia al aire
    this.airResistance.apply(this)

    // Actualizar la posición sumando la velocidad
    this.position = this.position.add(this.velocity)

    // Verificar colisiones con los límites
    // this.handleHitXBoundary()

    // this.collisionHandler.checkGroundCollision()

    if (this.collisionHandler.isInGround(this)) {
      this.friction.apply(this)
    }
  }

  draw() {
    this.ctx.beginPath()

    // Dibuja un círculo completo
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)

    this.ctx.fillStyle = this.color
    this.ctx.fill()

    this.ctx.closePath()
  }

  isAtRest(threshold: number = 0.05): boolean {
    return (
      Math.abs(this.velocity.x) < threshold &&
      Math.abs(this.velocity.y) < threshold
    )
  }
  drawMouseLine(mouse: Mouse) {
    const position = mouse.getPosition()

    this.ctx.beginPath()
    this.ctx.moveTo(position.x, position.y)
    this.ctx.lineTo(this.position.x, this.position.y)
    this.ctx.strokeStyle = 'hsl(45.9 96.7% 64.5%)'
    this.ctx.stroke()
    this.ctx.closePath()
  }

  public CheckCollision(others: Circle[]) {
    for (const other of others) {
      if (other === this) continue
      this.checkCollision(other)
    }
  }

  private checkCollision(other: Circle) {
    const distance = Vector.distance(this.position, other.position)
    const radiusSum = this.radius + other.radius

    // Check for collision
    if (distance < radiusSum) {
      // Calculate normal vector
      const normal = Vector.subtract(other.position, this.position).normalize()
      const tangent = new Vector(-normal.y, normal.x) // Perpendicular vector

      // Project velocities onto normal and tangent
      const v1n = Vector.dot(this.velocity, normal)
      const v1t = Vector.dot(this.velocity, tangent)
      const v2n = Vector.dot(other.velocity, normal)
      const v2t = Vector.dot(other.velocity, tangent)

      // Apply collision formulas
      const m1 = this.mass
      const m2 = other.mass

      const newV1n = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2)
      const newV2n = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2)

      // Convert back to vector form
      const finalV1n = Vector.scale(normal, newV1n)
      const finalV1t = Vector.scale(tangent, v1t)
      const finalV2n = Vector.scale(normal, newV2n)
      const finalV2t = Vector.scale(tangent, v2t)

      // Update velocities
      this.velocity = Vector.add(finalV1n, finalV1t)
      other.velocity = Vector.add(finalV2n, finalV2t)

      // Apply damping to slow down the velocities
      const dampingFactor = 0.995 // Factor to reduce velocity after collision
      this.velocity = this.velocity.scale(dampingFactor)
      other.velocity = other.velocity.scale(dampingFactor)

      // Adjust positions to prevent overlap
      const overlap = radiusSum - distance
      const correction = normal.scale(overlap / 2)
      this.position = this.position.subtract(correction)
      other.position = other.position.add(correction)
    }
  }

  // private handleHitXBoundary() {
  //   if (this.position.x + this.radius > innerWidth) {
  //     this.position.x = innerWidth - this.radius // Ajustar posición
  //     this.velocity.x = -this.velocity.x // Invertir velocidad
  //   } else if (this.position.x - this.radius < 0) {
  //     this.position.x = this.radius // Ajustar posición
  //     this.velocity.x = -this.velocity.x // Invertir velocidad
  //   }
  // }
}
