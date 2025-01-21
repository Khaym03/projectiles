import { Proyectile } from '../types'
import { Vector } from '../vector'

export class VelocityArrow {
  private baseArrowLength = 10
  private baseArrowHeadLength = 12
  private arrowLength: number | undefined
  private arrowHeadLength: number | undefined
  private velocityColor = 'hsl(158.1 64.4% 51.6%)'
  private lineWidth = 3

  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(p: Proyectile) {
    // Calcular la magnitud de la velocidad
    const speedMagnitude = p.velocity.magnitude()

    // Ajustar la longitud de la flecha en función de la magnitud de la velocidad
    this.arrowLength = this.baseArrowLength * (speedMagnitude / 10) // Ajusta el divisor según sea necesario
    this.arrowHeadLength = this.baseArrowHeadLength * (speedMagnitude / 5) // Ajusta el divisor según sea necesario

    // Calcular la posición final del vector
    const endPoint = p.position.add(p.velocity.scale(this.arrowLength))

    this.body(p.position, endPoint)
    this.head(p, endPoint)
  }

  private body(origin: Vector, endPoint: Vector) {
    // Dibujar la línea del vector
    this.ctx.beginPath()
    this.ctx.moveTo(origin.x, origin.y) // Punto inicial
    this.ctx.lineTo(endPoint.x, endPoint.y) // Punto final
    this.ctx.strokeStyle = this.velocityColor // Color del vector
    this.ctx.lineWidth = this.lineWidth // Ancho de la línea
    this.ctx.stroke()
  }

  private head(p: Proyectile, endPoint: Vector) {
    if (!this.arrowHeadLength || !this.arrowLength) return

    const angle = p.velocity.angle()

    // Puntos para las cabezas de la flecha
    const headPoint1X =
      endPoint.x - this.arrowHeadLength * Math.cos(angle - Math.PI / 6)
    const headPoint1Y =
      endPoint.y - this.arrowHeadLength * Math.sin(angle - Math.PI / 6)

    const headPoint2X =
      endPoint.x - this.arrowHeadLength * Math.cos(angle + Math.PI / 6)
    const headPoint2Y =
      endPoint.y - this.arrowHeadLength * Math.sin(angle + Math.PI / 6)

    // Dibujar las cabezas de la flecha
    this.ctx.beginPath()
    this.ctx.moveTo(endPoint.x, endPoint.y)
    this.ctx.lineTo(headPoint1X, headPoint1Y)

    this.ctx.moveTo(endPoint.x, endPoint.y)
    this.ctx.lineTo(headPoint2X, headPoint2Y)

    this.ctx.strokeStyle = this.velocityColor // Color de las cabezas de la flecha
    this.ctx.stroke()
  }
}
