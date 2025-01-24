import { Vector } from './vector'
export class Mouse {
  ctx: CanvasRenderingContext2D
  private position: Vector
  private isDown = false

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.position = new Vector(0, 0)

    // addEventListener('click', e => {
    //   this.position = new Vector(e.clientX, e.clientY)
    // })

    // addEventListener('mousedown', e => {
    //   this.isDown = true
    //   this.position = new Vector(e.clientX, e.clientY)
    // })

    // addEventListener('mouseup', () => {
    //   this.isDown = false
    // })

    // addEventListener('mousemove', e => {
    //   if (this.isDown) {
    //     this.position = new Vector(e.clientX, e.clientY)
    //   }
    // })
  }

  setIsDown(value: boolean) {
    this.isDown = value
  }

  getIsDown() {
    return this.isDown
  }

  setPosition(p: Vector) {
    this.position = p
  }

  getPosition(): Vector {
    return this.position
  }

  toggleIsDown() {
    this.isDown = !this.isDown
  }
}
