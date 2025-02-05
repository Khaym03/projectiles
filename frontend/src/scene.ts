import { AttackAnimation, Entity } from './types'
import { FPS } from './constants'
import { CartesianPlane } from './plane'
import { GravityArrow } from './arrows/gravity-arrow'
import { GravityForce } from './forces/gravity'
import { Circle, Player } from './circle'
import { VelocityArrow } from './arrows/arrow'
import Blaster from './blaster'
import Particle from './particle'
import { Vector } from './vector'
import Config from './config'
import { CollisionHandler } from './collisions'
import {
  BarsFromSide,
  BarsFromTopToBottom,
  ReverseOfBarsFromTopToBottom,
  SquaresFromBottomLeftToTopRight,
  SquaresFromTopRightToBottomLeft,
  TwoBigBarsFromSide,
  TwoBigBarsFromTopToBottom
} from './attacks/BarsFromTopToBottom'
import MouseConnector from './mouse-conector'
import { Mouse } from './mouse'
import { AudioAttackSynchronizer } from './attacks/audioAttack'
import Music from '@/assets/theatore.mp3'
import { GameOver } from './game-over'
import { Winner } from './winner'

export class Scene {
  private readonly msPerFrame = 1000 / FPS
  private lastFrameTime = 0
  public cartesianPlane: CartesianPlane

  public gravityForce = new GravityForce()
  public collisionHandler: CollisionHandler

  private gravityArrow: GravityArrow
  private velocityArrow: VelocityArrow

  private particles: Particle[] = []
  private attacks: AttackAnimation[] = []

  private mouseConnector: MouseConnector

  private audioSynchronizer: AudioAttackSynchronizer | null = null

  private gameOver: GameOver

  public playerWon = false

  private winner: Winner = new Winner()

  constructor(
    private ctx: CanvasRenderingContext2D,
    private player: Player,
    private entities: Entity[],
    private proyectiles: Circle[],
    private blasters: Blaster[],
    private config: Config,
    private mouse: Mouse
  ) {
    this.cartesianPlane = new CartesianPlane(this.ctx)
    this.gravityArrow = new GravityArrow(this.ctx)
    this.velocityArrow = new VelocityArrow(this.ctx)

    this.gameOver = new GameOver(this.ctx)

    this.collisionHandler = new CollisionHandler()

    this.mouseConnector = new MouseConnector(this.ctx, this.mouse)

    this.loadAudio(Music)

    this.attacks.push(
      new BarsFromTopToBottom(this.ctx, this.player),
      new BarsFromSide(this.ctx, this.player),
      new TwoBigBarsFromTopToBottom(this.ctx, this.player),
      new TwoBigBarsFromSide(this.ctx, this.player),
      new SquaresFromTopRightToBottomLeft(this.ctx, this.player),
      new SquaresFromBottomLeftToTopRight(this.ctx, this.player),
      new ReverseOfBarsFromTopToBottom(this.ctx, this.player)
    )

    if (this.config.allowGravityChange) {
      setInterval(() => {
        this.collisionHandler.changeGravityDirection()
      }, 1000 * 8)
    }
  }

  render(currentTime: number) {
    const deltaTime = currentTime - this.lastFrameTime
    // if(this.audioSynchronizer === null) return

    if (deltaTime >= this.msPerFrame) {
      this.ctx.clearRect(0, 0, innerWidth, innerHeight)

      if (this.audioSynchronizer && this.audioSynchronizer.ended) {
        this.playerWon = true
        this.winner.show()
      }

      if (this.config.gameMode === 'game' && this.player.hp <= 0) {
        this.audioSynchronizer.stop()
        this.gameOver.draw()
        return
      }

      this.gravityForce.setGravity(this.collisionHandler.gravityDirection)

      if (this.config.gameMode === 'game')
        this.attacks.forEach(attack => {
          attack.update()
          attack.draw()
        })

      // this.ctx.fillStyle = 'rgba(0, 0, 0, 0.01)'
      // this.ctx.fillRect(0, 0, innerWidth, innerHeight)
      if (this.config.showBackgorundPlane)
        this.cartesianPlane.drawbackgroundAxis(innerWidth, innerHeight)

      if (this.config.showCenterOfThePlane)
        this.cartesianPlane.drawCenterOfThePlane(innerWidth, innerHeight)

      if (this.config.showParticles && this.particles.length < 5) {
        this.particles.push(
          new Particle(
            this.ctx,
            5,
            5,
            new Vector(Math.random() * innerWidth, Math.random() * innerHeight),
            new Vector(10, 10)
          )
        )
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
        blaster.checkCollision(this.player)
        blaster.draw()
      })

      if (this.config.gameMode === 'game') this.playerLogic(currentTime)

      this.proyectiles.forEach(proyectile => {
        this.gravityForce.apply(proyectile)

        proyectile.update(currentTime)
        if (this.mouse.getIsDown()) this.mouseConnector.connect(proyectile)

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
        entity.update(currentTime)
        entity.draw()
      })

      requestAnimationFrame(this.render.bind(this))
    }
  }

  private playerLogic(deltaTime: number) {
    this.player.healthbar()

    this.gravityForce.apply(this.player)

    if (this.mouse.getIsDown()) this.mouseConnector.connect(this.player)

    if (this.config.colideHorizontal)
      if (this.config.gameMode === 'simulation')
        CollisionHandler.handleHitXBoundary(this.player)

    if (this.config.gameMode === 'game')
      CollisionHandler.handleHitXBoundary(this.player, 0.1)

    if (this.config.colisionVertical)
      CollisionHandler.hadlehitYBoundary(this.player)

    if (this.config.groundCollision)
      this.collisionHandler.checkGroundCollision(this.player)

    if (this.config.showGravityArrow) {
      this.gravityArrow.draw(
        this.player.position,
        this.gravityForce.getGravity()
      )
    }

    if (this.config.showVelocityArrow) this.velocityArrow.draw(this.player)

    this.player.update(deltaTime)

    this.player.CheckCollision(this.proyectiles)

    this.player.draw()
  }

  public executeRandomAttack(): void {
    const randomAttack =
      this.attacks[Math.floor(Math.random() * this.attacks.length)]

    randomAttack.attack()
  }

  private async loadAudio(filePath: string): Promise<void> {
    const response = await fetch(filePath) // Usa fetch para obtener el archivo
    const arrayBuffer = await response.arrayBuffer() // Convierte a ArrayBuffer

    if (!this.audioSynchronizer) {
      this.audioSynchronizer = new AudioAttackSynchronizer(
        this.attacks,
        this.particles
      ) // Inicializa si no está ya creado
    }

    await this.audioSynchronizer.loadAudio(arrayBuffer) // Carga el audio en el sincronizador
    if(this.config.playMusic) this.audioSynchronizer.start()
  
  }
}
