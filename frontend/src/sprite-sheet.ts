export class SpriteSheet {
    private image: HTMLImageElement;
    public frameWidth: number;
    public frameHeight: number;
    private totalFrames: number;
    private currentFrame: number;
    private isLoaded: boolean;
    private frameCount: number; // Contador de fotogramas
    private frameRate: number; // Número de frames antes de cambiar

    constructor(
        imageSrc: string,
        frameWidth: number,
        frameHeight: number,
        totalFrames: number,
        frameRate: number = 12 // Cambiar cada 15 frames por defecto
    ) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.totalFrames = totalFrames; // Total de fotogramas
        this.currentFrame = 0; // Fotograma actual
        this.isLoaded = false;
        this.frameCount = 0; // Inicializa el contador de fotogramas
        this.frameRate = frameRate; // Establece la tasa de frames

        // Evento para saber cuándo la imagen ha sido cargada
        this.image.onload = () => {
            this.isLoaded = true;
        };
    }

    // Método para dibujar el fotograma actual en el canvas
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        if (this.isLoaded) {
            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth, // X en el sprite sheet
                0, // Y en el sprite sheet (suponiendo que todos los fotogramas están en la misma fila)
                this.frameWidth,
                this.frameHeight,
                x, // X en el canvas
                y, // Y en el canvas
                this.frameWidth,
                this.frameHeight
            );
        }
    }

    // Método para actualizar el fotograma actual basado en el tiempo transcurrido
    update(): void {
        if (!this.isLoaded) return; // Si no está cargado, no hacer nada

        this.frameCount++; // Incrementar el contador de fotogramas

        if (this.frameCount >= this.frameRate) { 
            // Verificar si hemos alcanzado la tasa de frames
            this.currentFrame++; // Cambiar al siguiente fotograma

            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0; // Reiniciar al primer fotograma si se alcanza el final
            }

            this.frameCount = 0; // Reiniciar el contador de fotogramas
        }
    }
}
