import { Vector } from './vector';
import { Circle } from './circle';
import Sound from "@/assets/blaster.mp3"

export default class Blaster {
    private width = 10000; // Ancho del Blaster
    private height = 2; // Altura inicial
    private color = '#fff'; // Color del Blaster
    private isColliding = false; // Estado de colisión

    private easingFactor = 0.175; // Factor de easing

    private audio: HTMLAudioElement

    constructor(
        private ctx: CanvasRenderingContext2D,
        private position: Vector,
        private target: Vector
    ) {
        this.audio = new Audio(Sound)
        this.audio.volume = 0.3
        this.audio.play()
        
    }

    update() {
        this.color = this.isColliding ? 'red' : '#fff'; // Cambia el color si hay colisión

        // Aumenta la altura con easing
        if (this.height < 20) {
            this.height += (20 - this.height) * this.easingFactor; // Aumenta hasta 20
        }
    }

    draw() {
        this.ctx.save(); // Guarda el estado actual del contexto
        
        // Calcula el ángulo hacia el objetivo
        const direction = Vector.subtract(this.target, this.position); // Dirección hacia el objetivo
        const angle = Math.atan2(direction.y, direction.x); // Calcula el ángulo en radianes

        this.ctx.translate(
            this.position.x, // Mantiene la posición X constante
            this.position.y  // Mantiene la posición Y constante
        ); 
        this.ctx.rotate(angle); // Rota el contexto hacia el objetivo
        this.ctx.fillStyle = this.color; // Establece el color de relleno

        // Dibuja el rectángulo centrado en Y, expandiendo hacia arriba y hacia abajo
        this.ctx.fillRect(
            -this.width / 2,
            -this.height / 2, // Comienza desde la mitad negativa de la altura
            this.width,
            this.height
        ); 

        this.ctx.restore(); // Restaura el estado guardado del contexto
    }

    checkCollision(circle: Circle): boolean {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        // Encuentra las esquinas del rectángulo en coordenadas globales
        const rectCenterX = this.position.x;
        const rectCenterY = this.position.y;

        // Calcula la posición del círculo respecto al centro del rectángulo
        const translatedCircleX = circle.position.x - rectCenterX;
        const translatedCircleY = circle.position.y - rectCenterY;

        // Calcula el ángulo hacia el objetivo para aplicar la rotación inversa
        const direction = Vector.subtract(this.target, this.position);
        const angle = Math.atan2(direction.y, direction.x);

        const cosAngle = Math.cos(-angle);
        const sinAngle = Math.sin(-angle);

        // Aplica la inversa de la rotación al círculo para comprobar la colisión en espacio local
        const rotatedCircleX =
            translatedCircleX * cosAngle - translatedCircleY * sinAngle;
        const rotatedCircleY =
            translatedCircleX * sinAngle + translatedCircleY * cosAngle;

        // Encuentra el punto más cercano en el rectángulo alineado a los ejes
        const closestX = Math.max(-halfWidth, Math.min(rotatedCircleX, halfWidth));
        const closestY = Math.max(-halfHeight, Math.min(rotatedCircleY, halfHeight));

        // Calcula la distancia entre el círculo y este punto más cercano en coordenadas locales
        const distanceX = rotatedCircleX - closestX;
        const distanceY = rotatedCircleY - closestY;

        // Comprueba si hay colisión
        const collisionDetected =
            distanceX * distanceX + distanceY * distanceY <
            circle.radius * circle.radius;

        // Actualiza el estado de colisión
        this.isColliding = collisionDetected;

        return collisionDetected;
    }

    setTarget(newTarget: Vector) {
        this.target = newTarget; // Actualiza el objetivo al que apunta el Blaster
    }
}
