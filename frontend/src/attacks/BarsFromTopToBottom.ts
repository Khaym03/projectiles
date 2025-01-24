import { Vector } from '../vector'
import { Rectangle } from '../rectangle'
import {
  easeInOutQuart,
  EasingFunction,
  easingList,
  randomItem
} from '@/lib/utils'
import { Circle } from '@/circle'

export class BarsFromTopToBottom {
  numOfSegments = 4
  gap = 1
  w = innerWidth / this.numOfSegments - this.gap
  h = 150
  durationToReachTarget = 2250

  msPerSpawn = 500

  bars: Rectangle[] = []

  public ease: EasingFunction = easeInOutQuart

  constructor(public ctx: CanvasRenderingContext2D, public player: Circle) {}

  attack() {
    this.ease = randomItem(easingList)
    for (let i = 0; i < this.numOfSegments; i++) {
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
    return this.bars.length * this.durationToReachTarget
  }
}

export class ReverseOfBarsFromTopToBottom extends BarsFromTopToBottom {
  constructor(public ctx: CanvasRenderingContext2D, public player: Circle) {
    super(ctx, player) // Llama al constructor de la clase base
    this.w = innerWidth / this.numOfSegments // Ancho de cada barra
    this.h = 150 // Altura de cada barra
  }

  attack() {
    this.ease = randomItem(easingList) // Selecciona un easing aleatorio
    for (let i = 0; i < this.numOfSegments; i++) {
      // Cambia a un bucle normal
      const targetPosition = new Vector(
        (i * innerWidth) / this.numOfSegments, // Posición objetivo en el eje X
        -this.h // Comienza desde fuera del canvas por encima
      )

      setTimeout(() => {
        this.bars.push(
          new Rectangle(
            this.ctx,
            new Vector(
              (i * innerWidth) / this.numOfSegments, // Posición inicial en el eje X
              innerHeight + this.h // Comienza fuera del canvas por debajo
            ),
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

export class SquaresFromTopRightToBottomLeft extends BarsFromTopToBottom {
  constructor(public ctx: CanvasRenderingContext2D, public player: Circle) {
    super(ctx, player) // Llama al constructor de la clase base
    this.w = 25
    this.h = 25
  }

  attack() {
    this.ease = randomItem(easingList)
    for (let i = 0; i < this.numOfSegments; i++) {
      const targetPosition = new Vector(
        (i * innerWidth) / this.numOfSegments,
        innerHeight + this.h
      )

      setTimeout(() => {
        this.bars.push(
          new Rectangle(
            this.ctx,
            new Vector(
              innerWidth - (i * innerWidth) / this.numOfSegments,
              -this.h
            ), // Comienza desde la derecha
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

export class SquaresFromBottomLeftToTopRight extends BarsFromTopToBottom {
  constructor(public ctx: CanvasRenderingContext2D, public player: Circle) {
    super(ctx, player) // Llama al constructor de la clase base
    this.w = 25 // Ancho del cuadrado
    this.h = 25 // Alto del cuadrado
  }

  attack() {
    this.ease = randomItem(easingList)
    for (let i = 0; i < this.numOfSegments; i++) {
      const targetPosition = new Vector(
        innerWidth,
        -this.h // Comienza desde la parte inferior (fuera del canvas)
      )

      setTimeout(() => {
        this.bars.push(
          new Rectangle(
            this.ctx,
            new Vector(
              (i * innerWidth) / this.numOfSegments, // Posición inicial en la parte inferior izquierda
              innerHeight + this.h // Comienza fuera del canvas por debajo
            ),
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

export class TwoBigBarsFromTopToBottom extends BarsFromTopToBottom {
  constructor(ctx: CanvasRenderingContext2D, player: Circle) {
    super(ctx, player)
    this.numOfSegments = 2
    this.gap = 1
    this.h = 100
    this.w = innerWidth / this.numOfSegments - this.gap
    this.durationToReachTarget = 2250
  }

  attack() {
    this.ease = randomItem(easingList)
    for (let i = 0; i < this.numOfSegments; i++) {
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
}

export class BarsFromSide extends BarsFromTopToBottom {
  constructor(ctx: CanvasRenderingContext2D, player: Circle) {
    super(ctx, player)
    this.numOfSegments = 4
    this.gap = 0.5
    this.h = innerHeight / this.numOfSegments - this.gap
    this.durationToReachTarget = 2250
  }

  attack() {
    this.ease = randomItem(easingList)
    for (let i = 0; i < this.numOfSegments; i++) {
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

export class TwoBigBarsFromSide extends BarsFromSide {
  constructor(ctx: CanvasRenderingContext2D, player: Circle) {
    super(ctx, player)
    this.numOfSegments = 2
    this.gap = 1
    this.h = innerHeight / this.numOfSegments - this.gap
    this.w = 100
    this.durationToReachTarget = 2250
  }

  attack() {
    this.ease = randomItem(easingList)
    for (let i = 0; i < this.numOfSegments; i++) {
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
