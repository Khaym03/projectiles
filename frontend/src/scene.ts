import { Entity } from './types'
import { FPS } from './constants'
import { CartesianPlane } from './plane'
import { GravityArrow } from './arrows/gravity-arrow'
import { GravityForce } from './forces/gravity'
import { Circle } from './circle'
import { VelocityArrow } from './arrows/arrow'
import Blaster from './blaster'
import Particle from './particle'
import { Vector } from './vector'
import Config from './config'
import { CollisionHandler } from './collisions'
export class Scene {
  private readonly msPerFrame = 1000 / FPS
  private lastFrameTime = 0
  public cartesianPlane: CartesianPlane

  public gravityForce = new GravityForce()
  public collisionHandler: CollisionHandler

  private gravityArrow: GravityArrow
  private velocityArrow: VelocityArrow

  private particles: Particle[] = []

  constructor(
    private ctx: CanvasRenderingContext2D,
    private entities: Entity[],
    private proyectiles: Circle[],
    private blasters: Blaster[],
    private config: Config
  ) {
    this.cartesianPlane = new CartesianPlane(this.ctx)
    this.gravityArrow = new GravityArrow(this.ctx)
    this.velocityArrow = new VelocityArrow(this.ctx)

    this.collisionHandler = new CollisionHandler()

    if (this.config.allowGravityChange) {
      setInterval(() => {
        this.collisionHandler.changeGravityDirection()
      }, 1000 * 5)
    }
  }

  render(currentTime: number) {
    const deltaTime = currentTime - this.lastFrameTime

    if (deltaTime >= this.msPerFrame) {
      this.ctx.clearRect(0, 0, innerWidth, innerHeight)

      this.gravityForce.setGravity(this.collisionHandler.gravityDirection)

      // this.ctx.fillStyle = 'rgba(0, 0, 0, 0.01)'
      // this.ctx.fillRect(0, 0, innerWidth, innerHeight)
      if (this.config.showBackgorundPlane)
        this.cartesianPlane.drawbackgroundAxis(innerWidth, innerHeight)

      if (this.config.showCenterOfThePlane)
        this.cartesianPlane.drawCenterOfThePlane(innerWidth, innerHeight)

      if (this.config.showParticles && this.particles.length < 10) {
        for (let i = 0; i < 21; i++) {
          this.particles.push(
            new Particle(
              this.ctx,
              5,
              5,
              new Vector(
                Math.random() * innerWidth,
                Math.random() * innerHeight
              ),
              new Vector(10, 10)
            )
          )
        }
      }

      const maxSpeed = 15 // Define el límite de velocidad

      for (let i = 0; i < this.particles.length; i++) {
        // Aplica la fuerza de gravedad
        this.gravityForce.apply(this.particles[i])

        // Normaliza la velocidad antes de aplicar cualquier fuerza
        this.particles[i].velocity.normalize()

        // Actualiza la posición de la partícula basándose en su velocidad
        this.particles[i].update()

        // Limitar la velocidad
        if (this.particles[i].velocity.magnitude() > maxSpeed) {
          this.particles[i].velocity = this.particles[i].velocity
            .normalize()
            .scale(maxSpeed)
        }

        // Dibuja la partícula
        this.particles[i].draw()
      }

      this.blasters.forEach(blaster => {
        blaster.update()
        blaster.checkCollision(this.proyectiles[0])
        blaster.draw()
      })

      this.proyectiles.forEach(proyectile => {
        this.gravityForce.apply(proyectile)
        proyectile.update()

        if (this.config.colideHorizontal)
          if (this.config.gameMode === 'simulation')
            CollisionHandler.handleHitXBoundary(proyectile)

        if (this.config.gameMode === 'game')
          CollisionHandler.handleHitXBoundary(proyectile, 0.1)

        if (this.config.colisionVertical)
          CollisionHandler.hadlehitYBoundary(proyectile)

        if (this.config.groundCollision)
          this.collisionHandler.checkGroundCollision(proyectile)

        proyectile.CheckCollision(this.proyectiles)

        proyectile.draw()

        if (this.config.showGravityArrow) {
          this.gravityArrow.draw(
            proyectile.position,
            this.gravityForce.getGravity()
          )
        }

        if (this.config.showVelocityArrow) this.velocityArrow.draw(proyectile)
      })

      this.entities.forEach(entity => {
        entity.update()
        entity.draw()
      })

      requestAnimationFrame(this.render.bind(this))
    }
  }
}
