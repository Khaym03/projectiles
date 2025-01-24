import { Vector } from './vector'
import { Circle } from './circle'
import { FOOTBALL, METER_PER_SECOND, PIXELS_PER_METER } from './constants'
import Config from './config'

export class Launcher {
  private angle = (45 * Math.PI) / 180
  private tubeLength = 100
  public position = new Vector(0, 0)

  private numOfProjectiles = 1

  constructor(
    private ctx: CanvasRenderingContext2D,
    private power: number,
    private config: Config
  ) {
    this.initializeControls()
  }

  draw() {
    let position: Vector

    if (this.config.gameMode === 'game') {
      position = new Vector(-1000, innerHeight + 1000)
    } else {
      position = new Vector(0, innerHeight)
    }

    const x = position.x + this.tubeLength * Math.cos(this.angle)
    const y = position.y - this.tubeLength * Math.sin(this.angle)

    this.ctx.beginPath()
    this.ctx.moveTo(position.x, position.y)
    this.ctx.lineTo(x, y)

    this.ctx.lineWidth = 4
    this.ctx.strokeStyle = '#fff'
    this.ctx.stroke()

    this.ctx.closePath()
  }

  fire(): Circle {
    const position = new Vector(1, innerHeight)
    const projectile = new Circle(
      this.ctx,
      position.scale(PIXELS_PER_METER),
      new Vector(0, 0).scale(METER_PER_SECOND), // at rest
      FOOTBALL.radius,
      FOOTBALL.mass
    )

    // Calcular la aceleración usando F = m * a => a = F / m
    const acceleration = this.power / FOOTBALL.mass // Aceleración en m/s²

    // Calcular el vector de velocidad inicial usando el ángulo
    const forceOfFire = Vector.fromPolar(
      acceleration * METER_PER_SECOND,
      this.angle
    )

    projectile.velocity = projectile.velocity.add(forceOfFire)

    this.numOfProjectiles++

    return projectile
  }

  update() {}

  rotateLeft(degree: number) {
    const angle = Math.max(0, this.angle - (degree * Math.PI) / 180)

    this.angle = angle
  }

  rotateRight(degree: number) {
    const angle = Math.min(Math.PI / 2, this.angle + (degree * Math.PI) / 180)
    this.angle = angle
  }

  private initializeControls(): void {
    window.addEventListener('keydown', event => {
      switch (event.key) {
        case 'ArrowUp':
          this.rotateRight(1)
          break
        case 'ArrowDown':
          this.rotateLeft(1)

          break
      }
      // event.preventDefault() // Evitar que se desplace la página al usar las flechas
    })
  }

  getAngle(): number {
    return (this.angle * 180) / Math.PI // to degrees
  }

  getPower(): number {
    return this.power
  }

  getNumOfProjectiles(): number {
    return this.numOfProjectiles
  }
}
