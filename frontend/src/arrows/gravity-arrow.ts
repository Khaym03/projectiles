import { Vector } from '../vector'; // Asegúrate de que el módulo Vector esté correctamente importado

export class GravityArrow {
  private baseArrowLength = 50; // Longitud base de la flecha
  private arrowHeadLength = 10; // Longitud de la cabeza de la flecha
  private color = 'hsl(349.7 89.2% 60.2%)'; // Color para el vector de gravedad
  private lineWidth = 4;

  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(origin: Vector, gravity: Vector) {
    // Calcular la longitud de la flecha en función de la magnitud de la gravedad
    const gravityMagnitude = gravity.magnitude();
    const arrowLength = this.baseArrowLength * (gravityMagnitude * 8); // Ajusta el divisor según sea necesario

    // Normalizar el vector de gravedad para obtener la dirección
    const gravityDirection = gravity.normalize();

    // Calcular el punto final de la flecha
    const endPoint = new Vector(
      origin.x + gravityDirection.x * arrowLength,
      origin.y + gravityDirection.y * arrowLength
    );

    this.body(origin, endPoint);
    this.head(endPoint, gravityDirection);
  }

  private body(origin: Vector, endPoint: Vector) {
    // Dibujar la línea del vector
    this.ctx.beginPath();
    this.ctx.moveTo(origin.x, origin.y); 
    this.ctx.lineTo(endPoint.x, endPoint.y); 
    this.ctx.strokeStyle = this.color; 
    this.ctx.lineWidth = this.lineWidth; 
    this.ctx.stroke();
  }

  private head(endPoint: Vector, direction: Vector) {
    // Calcular los puntos para las cabezas de la flecha
    const angle = Math.atan2(direction.y, direction.x); // Ángulo de dirección

    const headPoint1X = endPoint.x - this.arrowHeadLength * Math.cos(angle - Math.PI / 6);
    const headPoint1Y = endPoint.y - this.arrowHeadLength * Math.sin(angle - Math.PI / 6);

    const headPoint2X = endPoint.x - this.arrowHeadLength * Math.cos(angle + Math.PI / 6);
    const headPoint2Y = endPoint.y - this.arrowHeadLength * Math.sin(angle + Math.PI / 6);

    // Dibujar las cabezas de la flecha
    this.ctx.beginPath();
    this.ctx.moveTo(endPoint.x, endPoint.y);
    this.ctx.lineTo(headPoint1X, headPoint1Y);
    
    this.ctx.moveTo(endPoint.x, endPoint.y);
    this.ctx.lineTo(headPoint2X, headPoint2Y);

    this.ctx.strokeStyle = this.color; 
    this.ctx.stroke();
  }
}
