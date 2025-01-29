import GameOverVideo from '@/assets/loro-dark-souls.mp4';

export class GameOver {
  private onces = true;
  public video: HTMLVideoElement;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.video = document.createElement('video'); // Crear el elemento de video correctamente
    this.video.src = GameOverVideo;
    this.video.muted = false; // Opcional: silenciar el video si es necesario
    this.video.loop = false; // Opcional: configurar si el video debe repetirse
    this.video.controls = false
    this.video.volume = 0.9
  }

  draw() {
    this.ctx.font = 'bold 48px "Old Standard TT", serif';
    this.ctx.textAlign = 'center';

    this.ctx.fillText(`Game Over`, innerWidth / 2, innerHeight / 2);

    if (this.onces) {
        this.video.style.zIndex = "20"
        this.video.style.position = "absolute"
        this.video.style.top = "0"
        this.video.style.left = "0"
        this.video.style.width = "100%"
        this.video.style.height = "100%"

        document.body.appendChild(this.video); // Añadir el video al documento
      this.video.play(); // Reproducir el video solo una vez
      setTimeout(() => {
        location.reload(); // Recargar la página después de 3 segundos
      }, this.video.duration * 1000 + 500)
      this.onces = false; // Asegurarse de que el video solo se reproduzca una vez
    }
  }
}
