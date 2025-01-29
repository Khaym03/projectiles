import { Vector } from '../vector'
import { Rectangle } from '../rectangle'
import {
  easeInOutQuart,
  EasingFunction,
  easingList,
  randomItem
} from '@/lib/utils'
import { Player } from '@/circle'
import { SpriteSheet } from '@/sprite-sheet'
import SquareBulletSheet from '@/assets/square-bullet.png'
import SquareBulletSheet2 from '@/assets/square-bullet-purple.png'
// import HorizontalRect from '@/assets/rect-horizontal-sheet.png'

export class BarsFromTopToBottom {
  numOfSegments = 4
  gap = 1
  w = 320
  // innerWidth / this.numOfSegments - this.gap
  h = 128
  durationToReachTarget = 2250

  msPerSpawn = 500

  bars: Rectangle[] = []
  color = 'hsl(27, 96%, 61%)'

  public spriteSheet: SpriteSheet

  public ease: EasingFunction = easeInOutQuart

  constructor(public ctx: CanvasRenderingContext2D, public player: Player) {
    // this.spriteSheet = new SpriteSheet(HorizontalRect, this.w, this.h, 5)
  }

  attack() {
    this.ease = randomItem(easingList)
    let rect: Rectangle
    for (let i = 0; i < this.numOfSegments; i++) {
      const targetPosition = new Vector(
        (i * innerWidth) / this.numOfSegments,
        innerHeight + this.h
      )
      setTimeout(() => {
        rect = new Rectangle(
          this.ctx,
          new Vector((i * innerWidth) / this.numOfSegments, -this.h),
          targetPosition,
          this.w,
          this.h,
          this.durationToReachTarget,
          this.ease,
          this.spriteSheet
        )

        rect.setColor(this.color)
        this.bars.push(rect)
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
      if (bar.checkCollision(this.player)) this.player.takeDamage()
    })
  }

  duration(): number {
    return this.bars.length * this.durationToReachTarget
  }
}

export class ReverseOfBarsFromTopToBottom extends BarsFromTopToBottom {
  color = 'hsl(158.1, 64.4%, 51.6%'
  constructor(public ctx: CanvasRenderingContext2D, public player: Player) {
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
        const rect = new Rectangle(
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

        rect.setColor(this.color)
        this.bars.push(rect)
      }, i * this.msPerSpawn)
    }
  }
}

export class SquaresFromTopRightToBottomLeft extends BarsFromTopToBottom {
  constructor(public ctx: CanvasRenderingContext2D, public player: Player) {
    super(ctx, player) // Llama al constructor de la clase base
    this.w = 32
    this.h = 32

    this.spriteSheet = new SpriteSheet(SquareBulletSheet2, this.w, this.h, 5)
  }

  attack() {
    this.ease = randomItem(easingList)
    let rect: Rectangle
    for (let i = 0; i < this.numOfSegments; i++) {
      const targetPosition = new Vector(
        (i * innerWidth) / this.numOfSegments,
        innerHeight + this.h
      )

      setTimeout(() => {
        rect = new Rectangle(
          this.ctx,
          new Vector(
            innerWidth - (i * innerWidth) / this.numOfSegments,
            -this.h
          ), // Comienza desde la derecha
          targetPosition,
          this.w,
          this.h,
          this.durationToReachTarget,
          this.ease,
          this.spriteSheet
        )

        this.bars.push(rect)
      }, i * this.msPerSpawn)
    }
  }
}

export class SquaresFromBottomLeftToTopRight extends BarsFromTopToBottom {
  constructor(public ctx: CanvasRenderingContext2D, public player: Player) {
    super(ctx, player) // Llama al constructor de la clase base
    this.w = 32 // Ancho del cuadrado
    this.h = 32 // Alto del cuadrado

    this.spriteSheet = new SpriteSheet(SquareBulletSheet, this.w, this.h, 5)
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
            this.ease,
            this.spriteSheet
          )
        )
      }, i * this.msPerSpawn)
    }
  }
}

export class TwoBigBarsFromTopToBottom extends BarsFromTopToBottom {
  constructor(ctx: CanvasRenderingContext2D, player: Player) {
    super(ctx, player)
    this.numOfSegments = 2
    this.gap = 1
    this.h = 100
    this.w = innerWidth / this.numOfSegments - this.gap
    this.durationToReachTarget = 2250
    this.color =  "hsl(187.9, 85.7%, 53.3%)"
  }

  attack() {
    this.ease = randomItem(easingList)
    let rect: Rectangle
    for (let i = 0; i < this.numOfSegments; i++) {
      const targetPosition = new Vector(
        (i * innerWidth) / this.numOfSegments,
        innerHeight + this.h
      )
      setTimeout(() => {
        rect =  new Rectangle(
          this.ctx,
          new Vector((i * innerWidth) / this.numOfSegments, -this.h),
          targetPosition,
          this.w,
          this.h,
          this.durationToReachTarget,
          this.ease
        )

        rect.setColor(this.color)
        this.bars.push(rect)
        
      }, i * this.msPerSpawn)
    }
  }
}

export class BarsFromSide extends BarsFromTopToBottom {
  constructor(ctx: CanvasRenderingContext2D, player: Player) {
    super(ctx, player)
    this.numOfSegments = 4
    this.gap = 0.5
    this.h = innerHeight / this.numOfSegments - this.gap
    this.durationToReachTarget = 2250
    this.color = "hsl(234.5, 89.5%, 73.9%)"
  }

  attack() {
    this.ease = randomItem(easingList)
    let rect: Rectangle
    for (let i = 0; i < this.numOfSegments; i++) {
      const targetPosition = new Vector(
        innerWidth + this.w,
        (i * innerHeight) / this.numOfSegments
      )

      setTimeout(() => {
        rect = new Rectangle(
          this.ctx,
          new Vector(-this.w, (i * innerHeight) / this.numOfSegments),
          targetPosition,
          this.w,
          this.h,
          this.durationToReachTarget,
          this.ease
        )

        rect.setColor(this.color)
        this.bars.push(rect)
      
      }, i * this.msPerSpawn)
    }
  }
}

export class TwoBigBarsFromSide extends BarsFromSide {
  constructor(ctx: CanvasRenderingContext2D, player: Player) {
    super(ctx, player)
    this.numOfSegments = 2
    this.gap = 1
    this.h = innerHeight / this.numOfSegments - this.gap
    this.w = 100
    this.durationToReachTarget = 2250
    this.color = "hsl(82.7, 78%, 55.5%)"
  }

  attack() {
    this.ease = randomItem(easingList)
    let rect: Rectangle
    for (let i = 0; i < this.numOfSegments; i++) {
      const targetPosition = new Vector(
        innerWidth + this.w,
        (i * innerHeight) / this.numOfSegments
      )

      setTimeout(() => {
        rect = new Rectangle(
          this.ctx,
          new Vector(-this.w, (i * innerHeight) / this.numOfSegments),
          targetPosition,
          this.w,
          this.h,
          this.durationToReachTarget,
          this.ease
        )

        rect.setColor(this.color)

        this.bars.push(
          rect
        )
      }, i * this.msPerSpawn)
    }
  }
}
