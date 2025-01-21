import { Entity } from './types'
import { FPS } from './constants'
import { CartesianPlane } from './plane'
import { GravityArrow } from './arrows/gravity-arrow'
import { GravityForce } from './forces/gravity'
import { Circle } from './circle'
import { VelocityArrow } from './arrows/arrow'
export class Scene {
  private readonly msPerFrame = 1000 / FPS
  private lastFrameTime = 0
  public cartesianPlane: CartesianPlane

  public gravityForce = new GravityForce()

  private gravityArrow: GravityArrow
  private velocityArrow: VelocityArrow

  private showGravityArrow = true
  private showVelocityArrow = true

  constructor(
    private ctx: CanvasRenderingContext2D,
    private entities: Entity[],
    private proyectiles: Circle[]
  ) {
    this.cartesianPlane = new CartesianPlane(this.ctx)
    this.gravityArrow = new GravityArrow(this.ctx)
    this.velocityArrow = new VelocityArrow(this.ctx)
  }

  render(currentTime: number) {
    const deltaTime = currentTime - this.lastFrameTime

    if (deltaTime >= this.msPerFrame) {
      this.ctx.clearRect(0, 0, innerWidth, innerHeight)

      // this.ctx.fillStyle = 'rgba(0, 0, 0, 0.01)'
      // this.ctx.fillRect(0, 0, innerWidth, innerHeight)

      this.cartesianPlane.draw(innerWidth, innerHeight)

      this.proyectiles.forEach(proyectile => {
        this.gravityForce.apply(proyectile)
        proyectile.update()
        proyectile.CheckCollision(this.proyectiles)
        proyectile.draw()

        if (this.showGravityArrow) {
          this.gravityArrow.draw(
            proyectile.position,
            this.gravityForce.getGravity()
          )
        }

        if (this.showVelocityArrow) this.velocityArrow.draw(proyectile)
      })

      this.entities.forEach(entity => {
        entity.update()
        entity.draw()
      })

      requestAnimationFrame(this.render.bind(this))
    }
  }

  displayGravityArrow(v: boolean) {
    this.showGravityArrow = v
  }
  displayVelocityArrow(v: boolean) {
    this.showVelocityArrow = v
  }
}
