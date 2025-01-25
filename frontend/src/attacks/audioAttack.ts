import Particle from '@/particle'
import { AttackAnimation } from '@/types'

export class AudioAttackSynchronizer {
  private audioContext: AudioContext
  private analyser: AnalyserNode
  private source: AudioBufferSourceNode | null = null
  private dataArray: Uint8Array
  // private threshold: number
  private attackInProgress = false

  constructor(
    public listOfAttacks: AttackAnimation[],
    private particles: Particle[],
    // threshold: number = 100
  ) {
    this.audioContext = new window.AudioContext()
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 2048
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    // this.threshold = threshold
  }

  // Cambiar el tipo de parámetro a ArrayBuffer
  async loadAudio(arrayBuffer: ArrayBuffer): Promise<void> {
    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer) // Decodifica
      this.source = this.audioContext.createBufferSource()
      this.source.buffer = audioBuffer
      this.source.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)
    } catch (error) {
      console.error(`Error al decodificar el audio: ${error.message}`)
    }
  }

  start(): void {
    if (this.source) {
      this.source.start()
      this.update()
    } else {
      console.error('El audio no ha sido cargado.')
    }
  }

  stop(): void {
    if (this.source) this.source.stop()
  }

  private update(): void {
    if (!this.source) return

    this.analyser.getByteFrequencyData(this.dataArray)

    // Recorre el dataArray y busca picos
    for (let i = 0; i < this.particles.length; i++) {
      const amplitude = this.dataArray[i]

      // Define un umbral para considerar un pico
      const threshold = 100 // Ajusta este valor según sea necesario

      if (amplitude > threshold) {
        this.particles[i].updateSize(amplitude) // Ajustar tamaño según la amplitud del pico
      } else {
        // Opcional: Reducir el tamaño si no hay pico
        this.particles[i].updateSize(5) // Tamaño mínimo o por defecto
      }
    }

    const beatInterval = 2250 // Intervalo de ritmo en ms
    const frenecy = 80 // Frecuencia de la señal en Hz

    const averageAmplitude =
      this.dataArray.reduce((sum, value) => sum + value) / this.dataArray.length

    // console.log(averageAmplitude)
    if (averageAmplitude > frenecy && !this.attackInProgress) {
      this.attackInProgress = true
      const atk = this.randomAttack()
      atk.attack()

      // Reiniciar el flag después de un tiempo
      setTimeout(() => {
        this.attackInProgress = false
      }, beatInterval)
    }

    requestAnimationFrame(() => this.update())
  }

  private randomAttack(): AttackAnimation {
    const randomAttack =
      this.listOfAttacks[Math.floor(Math.random() * this.listOfAttacks.length)]

    return randomAttack
  }
}
