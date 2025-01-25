import { Vector } from './vector'
import { Entity } from './types'
import { CollisionHandler } from './collisions'
import { Friction } from './friction'
import { EARTH_GRAVITY, FOOTBALL } from './constants'
import { Mouse } from './mouse'
import { AirResistance } from './forces/air-resistance'
import HeartImg from '@/assets/heart-sheet-sheet.png'
import { SpriteSheet } from './sprite-sheet'

export class Circle implements Entity {
  public gravity = EARTH_GRAVITY
  public friction = new Friction(0.8)
  public airResistance = new AirResistance()
  public velocityColor = 'green'
  public color = 'hsl(217.2 91.2% 59.8%)'
  public collisionHandler = new CollisionHandler()

  constructor(
    public ctx: CanvasRenderingContext2D,
    public position: Vector,
    public velocity: Vector,
    public radius: number,

    public mass: number
  ) {}

  update(_deltaTime: number) {
    if (this.isAtRest()) {
      this.velocity.x = 0
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

  public area(): number {
    return Math.PI * this.radius * this.radius
  }
}

export class Player extends Circle {
  public hp = 5
  public isInvencible = false
  public heartSpriteSheet: SpriteSheet

  constructor(
    ctx: CanvasRenderingContext2D,
    position: Vector,
    velocity: Vector
  ) {
    super(ctx, position, velocity, 30, FOOTBALL.mass)

    this.heartSpriteSheet = new SpriteSheet(HeartImg, 32, 32, 2)
  }

  update(_deltaTime: number) {
    this.heartSpriteSheet.update()

    if (this.isAtRest()) {
      this.velocity.x = 0
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

  takeDamage() {
    if (this.isInvencible) return

    this.hp--
    this.isInvencible = true
    this.color = 'red'
    setTimeout(() => {
      this.isInvencible = false
      this.color = 'hsl(217.2 91.2% 59.8%)'
    }, 1000)
  }

  healthbar() {
    const w = this.heartSpriteSheet.frameWidth; // Ancho del corazón
    const spacing = 5; // Espaciado entre corazones
    const centerScreenX = innerWidth / 2; // Centro de la pantalla
    const startX = centerScreenX - (this.hp * (w + spacing)) / 2; // Ajustar para el espacio
    const y = innerHeight * 0.8; // Posición Y de la barra de salud

    for (let i = 0; i < this.hp; i++) {
        // Dibuja cada corazón en su propia posición
        this.heartSpriteSheet.draw(
            this.ctx,
            startX + i * (w + spacing), // Ajusta la posición X para cada corazón
            y
        );
    }
  }
}
