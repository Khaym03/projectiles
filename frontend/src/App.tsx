import './App.css'
import { useRef, useEffect, useState } from 'react'
import GameScreenShot from '@/assets/game-img.jpg'
import { Scene } from './scene'
import { Mouse } from './mouse'
import { Entity } from './types'
import { Circle, Player } from './circle'
import { Vector } from './vector'
import { Stats } from './stats'
import { FOOTBALL, METER_PER_SECOND, PIXELS_PER_METER } from './constants'
import { Launcher } from './launcher'
import Blaster from './blaster'

import {
  Quit,
  WindowFullscreen,
  WindowIsFullscreen,
  WindowUnfullscreen
} from '../wailsjs/runtime'
// import  { switchOption } from './components/swithces-list'
import Config, { gameConfig, physicsSimulationConfig } from './config'

const screenHandler = async () => {
  if (await WindowIsFullscreen()) {
    WindowUnfullscreen()
  } else WindowFullscreen()
}

addEventListener('keypress', e => {
  switch (e.key) {
    case 'f': {
      screenHandler()
      break
    }
  }
})

class AppController {
  public ctx: CanvasRenderingContext2D
  private player: Player

  public entities: Entity[] = []
  public scene: Scene
  public mouse: Mouse

  public panelStats: Stats | undefined

  // public proyectile: Circle
  private proyectiles: Circle[] = []
  private blasters: Blaster[] = []

  public launcher: Launcher | undefined

  constructor(public canvas: HTMLCanvasElement, public config: Config) {
    this.ctx = this.canvas.getContext('2d')!
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.mouse = new Mouse(this.ctx)

    if (this.config.showStats)
      this.panelStats = new Stats(this.ctx, this.config)

    if (this.config.gameMode === 'game') {
      this.player = new Player(
        this.ctx,
        new Vector(10, 10).scale(PIXELS_PER_METER),
        new Vector(5, 0).scale(METER_PER_SECOND)
      )
    } else {
      this.proyectiles.push(
        new Circle(
          this.ctx,
          new Vector(10, 10), //.scale(PIXELS_PER_METER)
          new Vector(5, 0).scale(METER_PER_SECOND),
          25,
          FOOTBALL.mass
        )
      )
    }

    this.scene = new Scene(
      this.ctx,
      this.player,
      this.entities,
      this.proyectiles,
      this.blasters,
      this.config,
      this.mouse
    )

    if (this.config.showStats) {
      this.launcher = new Launcher(this.ctx, 20, this.config)
      this.panelStats.setLauncher(this.launcher)
      this.panelStats.setProjectile(this.proyectiles[0])
      this.entities.push(this.panelStats)
      this.entities.push(this.launcher)
    }

    // this.entities.push(this.proyectile)

    this.setup()
    this.scene.render(Date.now())
  }

  setup() {
    if (this.config.allowBlasters) {
      setInterval(() => {
        this.blasters.pop()
        this.blasters.push(
          new Blaster(
            this.ctx,
            new Vector(Math.random() * innerWidth, Math.random() * innerHeight),
            this.player.position
            // (45 / 180) * Math.PI
          )
        )
      }, 1000)
    }

    addEventListener('resize', () => {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    })

    addEventListener('keydown', event => {
      switch (event.key) {
        case ' ': // Espacio para disparar
          {
            if (this.config.gameMode === 'game') this.mouse.toggleIsDown()

            // solucion temporal para el bug de la sombra en el fondo
            if (this.launcher && this.config.gameMode !== 'game') {
              const projectile = this.launcher.fire()
              this.proyectiles.push(projectile)
            }
          }
          break
        case 'r':
          {
            location.reload()
          }
          break
        // case 'f': {
        //   WindowMaximise()
        // }
      }
    })

    this.canvas.addEventListener('click', e => {
      this.mouse.toggleIsDown()
      this.mouse.setPosition(new Vector(e.clientX, e.clientY))
    })

    // this.canvas.addEventListener('mouseup', () => {
    //   if (this.config.gameMode === 'simulation')  this.mouse.setIsDown(false)

    // })

    this.canvas.addEventListener('mousemove', e => {
      if (this.mouse.getIsDown()) {
        this.mouse.setPosition(new Vector(e.clientX, e.clientY))
      }
    })
  }
}

function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<AppController | null>(null)
  const [config, setConfig] = useState<Config>(physicsSimulationConfig)
  const [playing, setPlaying] = useState(false)

  // const [showGravityArrow, setShowGravityArrow] = useState(true)
  // const [showVelocityArrow, setShowVelocityArrow] = useState(true)

  // const switches: switchOption[] = [
  // {
  //   label: 'Mostrar Vector de Gravedad',
  //   checked: showGravityArrow,
  //   handler: (v: boolean) => setShowGravityArrow(v)
  // },
  // {
  //   label: 'Mostrar Vector de Velocidad',
  //   checked: showVelocityArrow,
  //   handler: (v: boolean) => setShowVelocityArrow(v)
  // }
  // ]

  // useEffect(() => {
  //   if (!appRef.current) return
  //   appRef.current.config.showGravityArrow = showGravityArrow
  // }, [showGravityArrow])

  // useEffect(() => {
  //   if (!appRef.current) return
  //   appRef.current.config.showVelocityArrow = showVelocityArrow
  // }, [showVelocityArrow])

  useEffect(() => {
    if (!appRef.current) return
    appRef.current.config = config
  }, [config])

  useEffect(() => {
    if (ref.current && playing) {
      appRef.current = new AppController(ref.current, config)
    }

    return () => {
      appRef.current = null // Limpia la referencia
    }
  }, [playing, config])

  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center">
      <canvas
        className={playing ? '' : 'hidden'}
        ref={ref}
        id="canvas"
      ></canvas>
      <img
        src={GameScreenShot}
        alt="imagen del juego"
        className={
          playing
            ? 'hidden'
            : 'absolute top-0 left-0 w-full h-full object-cover filter blur-xl -z-10'
        }
      />

      <div className={`${playing ? 'hidden' : 'visible'} flex flex-col gap-4 mt-16`}>
        <button
          className="text-lg p-2 px-8 bg-black border-4 border-primary  rounded-md text-white  transition duration-400 shadow-primary  shadow-[-5px_5px_0px_0px]  hover:-translate-y-1 hover:translate-x-1 font-medium"
          onClick={() => {
            setPlaying(!playing)
            setConfig(gameConfig)
          }}
        >
          Minijuego
        </button>

        <button
          className="text-lg p-2 px-8 bg-black border-4 border-primary  rounded-md text-white transition duration-400 shadow-primary  shadow-[-5px_5px_0px_0px]  hover:-translate-y-1 hover:translate-x-1 font-medium"
          onClick={() => {
            setPlaying(!playing)
            setConfig(physicsSimulationConfig)
          }}
        >
          Simulacion
        </button>

        <button
          className="text-lg p-2 px-8 bg-black border-4 border-primary  rounded-md text-white transition duration-400 shadow-primary  shadow-[-5px_5px_0px_0px]  hover:-translate-y-1 hover:translate-x-1 font-medium"
          onClick={() => {
            Quit()
          }}
        >
          Salir
        </button>
      </div>

      {!playing ? (
        <>
          {/* <div className="flex items-center space-x-2 absolute top-4 right-4 px-4 py-2 bg-card-foreground border-2 border-primary rounded-md">
            {<SwitchesList switches={switches} />}
          </div> */}

          <div className="flex bottom-8 gap-8 mt-16">
            <label>F para Pantalla completa</label>
            <label>R para reiniciar</label>
          </div>
        </>
      ) : null}
    </section>
  )
}

export default App
