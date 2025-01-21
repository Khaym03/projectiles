import { Circle } from './circle';

export class CollisionHandler {
    constructor(private c: Circle) {}

    checkGroundCollision() {
        if (this.isInGround()) {
            this.adjustPositionForGroundCollision();
            this.applyVerticalBounce();
            this.checkVelocityVerticalCollision();
        }
    }

    isInGround(): boolean {
        return this.c.position.y + this.c.radius >= innerHeight; // Verifica si está en el suelo
    }

    private checkVelocityVerticalCollision() {
        // Detener completamente si la velocidad es muy baja y está en el suelo
        if (this.isInGround() && Math.abs(this.c.velocity.y) < 0.5) {
            this.c.velocity.y = 0; // Detener la velocidad vertical
        }
    }

    private applyVerticalBounce() {
        // Solo aplicar rebote si está cayendo
        if (this.c.velocity.y > 0) { 
            this.c.velocity.y = -this.c.velocity.y * 0.8; // Invertir dirección y reducir energía
        }
    }

    private adjustPositionForGroundCollision() {
        if (this.isInGround()) {
            this.c.position.y = innerHeight - this.c.radius; // Ajustar posición para que no se salga del canvas
        }
    }
}
