import { PIXELS_PER_METER } from './constants'
import { Vector } from './vector'

export class CartesianPlane {
  private lineWidth = 2
  private color = 'hsl(0, 0%, 33%)'

  // private xLine: [Vector, Vector]
  // = [
  //   new Vector(0, Math.ceil(innerHeight / 2)),
  //   new Vector(innerWidth, Math.ceil(innerHeight / 2))
  // ]

  // private yLine: [Vector, Vector]
  // = [
  //   new Vector(Math.ceil(innerWidth / 2), 0),
  //   new Vector(Math.ceil(innerWidth / 2), innerHeight)
  // ]

  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(w: number, h: number) {
    const xLine: [Vector, Vector] = [
      new Vector(0, Math.ceil(h / 2)),
      new Vector(innerWidth, Math.ceil(h / 2))
    ]

   const  yLine: [Vector, Vector] = [
      new Vector(Math.ceil(w / 2), 0),
      new Vector(Math.ceil(w / 2), h)
    ]

    const rows = Math.ceil(h / PIXELS_PER_METER)
    const cols = Math.ceil(w / PIXELS_PER_METER)

    for (let i = 0; i < rows; i++) {
      this.ctx.fillStyle = 'hsla(0, 0.00%, 100.00%, 0.20)'
      this.ctx.fillRect(0, i * rows, w, 1)
    }
    for (let i = 0; i < cols; i++) {
      this.ctx.fillStyle = 'hsla(0, 0.00%, 100.00%, 0.20)'
      this.ctx.fillRect(i * cols, 0, 1, h)
    }

    this.drawAxis(xLine[0], xLine[1])
    this.drawAxis(yLine[0], yLine[1])
  }

  drawAxis(from: Vector, to: Vector) {
    this.ctx.beginPath()
    this.ctx.moveTo(from.x, from.y)
    this.ctx.lineTo(to.x, to.y)
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = this.color
    this.ctx.stroke()
    this.ctx.closePath()
  }
}
