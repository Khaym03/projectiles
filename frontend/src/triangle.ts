import { Vector } from './vector'

export class Triangle {
  private ctx: CanvasRenderingContext2D
  private vertices: Vector[]

  constructor(
    ctx: CanvasRenderingContext2D,
    vertex1: Vector,
    vertex2: Vector,
    vertex3: Vector
  ) {
    this.ctx = ctx // Contexto del canvas
    this.vertices = [vertex1, vertex2, vertex3] // Vértices del triángulo
  }

  // Método para dibujar el triángulo
  draw(): void {
    this.ctx.beginPath()
    this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y) // Mover al primer vértice
    this.ctx.lineTo(this.vertices[1].x, this.vertices[1].y) // Dibujar línea al segundo vértice
    this.ctx.lineTo(this.vertices[2].x, this.vertices[2].y) // Dibujar línea al tercer vértice
    this.ctx.closePath() // Cerrar el triángulo

    this.ctx.fillStyle = 'blue' // Color de relleno
    this.ctx.fill() // Rellenar el triángulo
    this.ctx.strokeStyle = '#fff' // Color del borde
    this.ctx.stroke() // Dibujar el borde
  }

  // Método para rotar el triángulo alrededor de un punto (centro)
  rotate(angle: number, center: Vector): void {
    for (let i = 0; i < this.vertices.length; i++) {
      const vertex = this.vertices[i]

      // Trasladar el vértice al origen (restar el centro)
      const translatedX = vertex.x - center.x
      const translatedY = vertex.y - center.y

      // Rotar el vértice
      const rotatedVertex = new Vector(translatedX, translatedY).rotate(angle)

      // Trasladar de nuevo al punto original
      vertex.x = rotatedVertex.x + center.x
      vertex.y = rotatedVertex.y + center.y
    }
  }
}
