import { Circle } from './circle'
import { Entity } from './types'
import { Launcher } from './launcher'
import { Vector } from './vector'
import Config from './config'

export class Stats implements Entity {
  private rem = 16
  private proyectile: Circle | undefined
  private launcer: Launcher | undefined
  private ctx: CanvasRenderingContext2D
  public position: Vector = new Vector(0, 0)
  

  constructor(ctx: CanvasRenderingContext2D, private config: Config) {
    this.ctx = ctx
  }

  setProjectile(c: Circle) {
    this.proyectile = c
  }

  setLauncher(l: Launcher) {
    this.launcer = l
  }

  update(): void {}

  draw() {
    if (!this.proyectile || this.config.gameMode === 'game' || !this.launcer) return

    // Configurar estilo de texto
    this.ctx.fillStyle = 'white'
    this.ctx.font = 'italic 28px "Old Standard TT", serif'

    this.ctx.textAlign = 'left'

    // Dibujar velocidad
    this.ctx.fillText(
      `Velocidad: ${this.proyectile.velocity.x.toFixed(
        2
      )}, ${this.proyectile.velocity.y.toFixed(2)}`,
      this.rem,
      this.rem * 2
    )

    // Dibujar posición
    this.ctx.fillText(
      `Posición: ${this.proyectile.position.x.toFixed(
        2
      )}, ${this.proyectile.position.y.toFixed(2)}`,
      this.rem,
      this.rem * 4
    )

    this.ctx.fillText(
      `Angulo: ${this.launcer.getAngle().toFixed(2)}`,
      this.rem,
      this.rem * 6
    )

    this.ctx.fillText(
      `Newtons: ${this.launcer.getPower().toFixed(2)}`,
      this.rem,
      this.rem * 8
    )

    this.ctx.fillText(
      `Projectiles: ${this.launcer.getNumOfProjectiles()}`,
      this.rem,
      this.rem * 10
    )
  }
}
