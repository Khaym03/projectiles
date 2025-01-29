import { Circle } from './circle'
import { METER_PER_SECOND } from './constants'
import { Mouse } from './mouse'
import { Vector } from './vector'

export default class MouseConnector {
  private lenght = 80
  constructor(private ctx: CanvasRenderingContext2D, private mouse: Mouse) {}

  connect(c: Circle) {
    this.drawMouseLine(c)
    this.pullForce(c)
  }

  private pullForce(c: Circle) {
    const distance = Vector.distance(c.position, this.mouse.getPosition())

    const magnitude = distance * 0.3
    const angle = Vector.angle(c.position, this.mouse.getPosition())

    const force = Vector.fromPolar(magnitude, angle)

    if (distance > this.lenght) {
      c.velocity = c.velocity.add(force).scale(METER_PER_SECOND)
    }
  }

  private drawMouseLine(c: Circle) {
    const position = this.mouse.getPosition()

    this.ctx.beginPath()
    this.ctx.moveTo(c.position.x, c.position.y)
    this.ctx.lineTo(position.x, position.y)
    this.ctx.strokeStyle = 'hsl(45.9 96.7% 64.5%)'
    this.ctx.stroke()
    this.ctx.closePath()
  }
}
