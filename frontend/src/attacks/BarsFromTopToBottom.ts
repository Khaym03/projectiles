import { Vector } from '../vector'
import { Rectangle } from '../rectangle'
import { easeInOutQuart } from '@/lib/utils'
import { Circle } from '@/circle'

export class BarsFromTopToBottom {
  numOfSegments = 5
  gap = 1
  w = innerWidth / this.numOfSegments - this.gap
  h = 100
  durationToReachTarget = 2250

  msPerSpawn = 500

  bars: Rectangle[] = []

  ease = easeInOutQuart

  constructor(public ctx: CanvasRenderingContext2D, public player: Circle) {}

  attack() {
    for (let i = 0; i < 10; i++) {
      const targetPosition = new Vector(
        (i * innerWidth) / this.numOfSegments,
        innerHeight + this.h
      )
      setTimeout(() => {
        this.bars.push(
          new Rectangle(
            this.ctx,
            new Vector((i * innerWidth) / this.numOfSegments, -this.h),
            targetPosition,
            this.w,
            this.h,
            this.durationToReachTarget,
            this.ease
          )
        )
      }, i * this.msPerSpawn)
    }
  }

  update() {
    this.bars.forEach(bar => {
      bar.update()
    })
  }

  draw() {
    this.bars.forEach(bar => {
      bar.draw()
      bar.checkCollision(this.player)
    })
  }

  duration(): number {
    return this.bars.length * this.msPerSpawn
  }
}

export class BarsFromSide extends BarsFromTopToBottom {
  constructor(ctx: CanvasRenderingContext2D, player: Circle) {
    super(ctx, player)
    this.numOfSegments = 10
    this.gap = 0.5
    this.h = 100
    this.durationToReachTarget = 2250
  }

  attack() {
    for (let i = 0; i < 10; i++) {
      const targetPosition = new Vector(
        innerWidth + this.w,
        (i * innerHeight) / this.numOfSegments
      )

      setTimeout(() => {
        this.bars.push(
          new Rectangle(
            this.ctx,
            new Vector(-this.w, (i * innerHeight) / this.numOfSegments),
            targetPosition,
            this.w,
            this.h,
            this.durationToReachTarget,
            this.ease
          )
        )
      }, i * this.msPerSpawn)
    }
  }
}
