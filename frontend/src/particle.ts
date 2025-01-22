import { Vector } from './vector';

export default class Particle {
  public mass = 0.1; // Masa de la partícula
  private color = 'rgba(255, 255, 255, 0.05)'

  constructor(
    private ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    public position: Vector,
    public velocity: Vector
  ) {}

  update() {
    // Actualizar la posición de la partícula
    this.position = this.position.add(this.velocity);

    // Comprobamos si la partícula ha salido de los límites del canvas
    if (this.position.x > innerWidth) {
      // Reposicionar en el lado izquierdo al salir por el lado derecho
      this.position.x = -this.width; // Aparece justo fuera del lado izquierdo
      this.position.y = Math.random() * innerHeight; // Reposicionar aleatoriamente en y
    } else if (this.position.x + this.width < 0) {
      // Reposicionar en el lado derecho al salir por el lado izquierdo
      this.position.x = innerWidth; // Aparece justo fuera del lado derecho
      this.position.y = Math.random() * innerHeight; // Reposicionar aleatoriamente en y
    }

    if (this.position.y > innerHeight) {
      // Reposicionar en la parte superior al salir por abajo
      this.position.y = -this.height; // Aparece justo fuera en la parte superior
      this.position.x = Math.random() * innerWidth; // Reposicionar aleatoriamente en x
    } else if (this.position.y + this.height < 0) {
      // Reposicionar en la parte inferior al salir por arriba
      this.position.y = innerHeight; // Aparece justo fuera en la parte inferior
      this.position.x = Math.random() * innerWidth; // Reposicionar aleatoriamente en x
    }
  }

  draw() {
    this.ctx.rect(this.position.x, this.position.y, this.width, this.height);
    this.ctx.fillStyle = this.color
    this.ctx.fill();
  }
}
