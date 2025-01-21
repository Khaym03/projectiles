import './App.css'
import { useRef, useEffect, useState } from 'react'

import { Scene } from './scene'
import { Mouse } from './mouse'
import { Entity } from './types'
import { Circle } from './circle'
import { Vector } from './vector'
import { Stats } from './stats'
import { FOOTBALL, METER_PER_SECOND, PIXELS_PER_METER } from './constants'
import { Launcher } from './launcher'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

class AppController {
  public ctx: CanvasRenderingContext2D

  public entities: Entity[] = []
  public scene: Scene
  public mouse: Mouse

  public panelStats: Stats

  // public proyectile: Circle
  private proyectiles: Circle[] = []

  public launcher: Launcher

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d')!
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.scene = new Scene(this.ctx, this.entities, this.proyectiles)

    this.mouse = new Mouse(this.ctx)

    this.panelStats = new Stats(this.ctx)

    this.proyectiles.push(
      new Circle(
        this.ctx,
        this.mouse,
        new Vector(10, 10).scale(PIXELS_PER_METER),
        new Vector(5, 0).scale(METER_PER_SECOND),
        FOOTBALL.radius,
        FOOTBALL.mass
      )
    )

    this.launcher = new Launcher(this.ctx, this.mouse, 20) // Newtons
    this.panelStats.setLauncher(this.launcher)
    this.panelStats.setProjectile(this.proyectiles[0])

    // this.entities.push(this.proyectile)
    this.entities.push(this.panelStats)
    this.entities.push(this.launcher)

    this.setup()
    this.scene.render(Date.now())
  }

  setup() {
    addEventListener('resize', () => {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    })

    addEventListener('keydown', event => {
      switch (event.key) {
        case ' ': // Espacio para disparar
          {
            const projectile = this.launcher.fire()
            this.proyectiles.push(projectile)
          }
          break
      }
    })

    this.canvas.addEventListener('mousedown', e => {
      this.mouse.setIsDown(true)
      this.mouse.setPosition(new Vector(e.clientX, e.clientY))
    })

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.setIsDown(false)
    })

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

  const [showGravityArrow, setShowGravityArrow] = useState(true)
  const [showVelocityArrow, setShowVelocityArrow] = useState(true)

  useEffect(() => {
    if (ref.current) {
      appRef.current = new AppController(ref.current)
    }

    return () => {
      appRef.current = null // Limpia la referencia
    }
  }, [])

  return (
    <>
      <canvas ref={ref} id="canvas"></canvas>

      <div className="flex items-center space-x-2 absolute top-4 right-4 px-4 py-2 bg-card-foreground border-2 border-primary rounded-md">
        <Label className="text-white">Mostrar Vector de Gravedad</Label>
        <Switch
          checked={showGravityArrow}
          onCheckedChange={(v: boolean) => {
            setShowGravityArrow(v)
            appRef.current?.scene.displayGravityArrow(v)
          }}
          className=""
        >
          Mostrar Vector de gravedad
        </Switch>
        <Label className="text-white">Mostrar Vector de Velocidad</Label>
        <Switch
          checked={showVelocityArrow}
          onCheckedChange={(v: boolean) => {
            setShowVelocityArrow(v)
            appRef.current?.scene.displayVelocityArrow(v)
          }}
          className=""
        >
          Mostrar Vector de gravedad
        </Switch>
      </div>
    </>
  )
}

export default App
