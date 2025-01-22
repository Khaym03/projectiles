import { Circle } from './circle'
import { Vector } from './vector'
import { EARTH_GRAVITY } from './constants' // Gravedad normal hacia abajo

export class CollisionHandler {
  gravityDirection: Vector = EARTH_GRAVITY

  // Direcciones posibles de gravedad
  static gravityDirections: Vector[] = [
    EARTH_GRAVITY,
    Vector.scale(EARTH_GRAVITY, -1),
    new Vector(EARTH_GRAVITY.y, 0),
    new Vector(-EARTH_GRAVITY.y, 0)
  ]

  checkGroundCollision(c: Circle) {
    if (this.isInGround(c)) {
      this.adjustPositionForGroundCollision(c)
      this.applyBounce(c)
      this.checkVelocityCollision(c)
    }
  }

  isInGround(c: Circle): boolean {
    // Verifica si el círculo está en el suelo según la dirección de la gravedad
    if (this.gravityDirection.equals(EARTH_GRAVITY)) {
      return c.position.y + c.radius >= innerHeight // Gravedad hacia abajo
    } else if (this.gravityDirection.equals(Vector.scale(EARTH_GRAVITY, -1))) {
      return c.position.y - c.radius <= 0 // Gravedad hacia arriba
    } else if (this.gravityDirection.equals(new Vector(EARTH_GRAVITY.y, 0))) {
      return c.position.x + c.radius >= innerWidth // Gravedad hacia la derecha
    } else if (this.gravityDirection.equals(new Vector(-EARTH_GRAVITY.y, 0))) {
      return c.position.x - c.radius <= 0 // Gravedad hacia la izquierda
    }
    return false // Por defecto no está en el suelo
  }

  private checkVelocityCollision(c: Circle) {
    // Detener completamente si la velocidad es muy baja y está en el suelo
    if (this.isInGround(c) && Math.abs(this.getVerticalVelocity(c)) < 0.5) {
      this.setVerticalVelocity(c, 0) // Detener la velocidad vertical
    }
  }

  private applyBounce(c: Circle) {
    // Solo aplicar rebote si está cayendo en la dirección de la gravedad
    if (
      this.getVerticalVelocity(c) > 0 &&
      this.gravityDirection.equals(EARTH_GRAVITY)
    ) {
      this.setVerticalVelocity(c, -this.getVerticalVelocity(c) * 0.8) // Invertir dirección y reducir energía
    } else if (
      this.getVerticalVelocity(c) < 0 &&
      this.gravityDirection.equals(Vector.scale(EARTH_GRAVITY, -1))
    ) {
      this.setVerticalVelocity(c, -this.getVerticalVelocity(c) * 0.8) // Invertir dirección y reducir energía
    }
  }

  private adjustPositionForGroundCollision(c: Circle) {
    if (this.isInGround(c)) {
      if (this.gravityDirection.equals(EARTH_GRAVITY)) {
        c.position.y = innerHeight - c.radius // Ajustar posición para que no se salga del canvas
      } else if (
        this.gravityDirection.equals(Vector.scale(EARTH_GRAVITY, -1))
      ) {
        c.position.y = c.radius // Ajustar posición en caso de gravedad hacia arriba
      } else if (this.gravityDirection.equals(new Vector(EARTH_GRAVITY.y, 0))) {
        c.position.x = innerWidth - c.radius // Ajustar posición para gravedad a la derecha
      } else if (
        this.gravityDirection.equals(new Vector(-EARTH_GRAVITY.y, 0))
      ) {
        c.position.x = c.radius // Ajustar posición para gravedad a la izquierda
      }
    }
  }

  private getVerticalVelocity(c: Circle): number {
    return this.gravityDirection.equals(EARTH_GRAVITY) ||
      this.gravityDirection.equals(Vector.scale(EARTH_GRAVITY, -1))
      ? c.velocity.y
      : c.velocity.x // Devuelve la componente vertical según la dirección de gravedad
  }

  private setVerticalVelocity(c: Circle, velocity: number): void {
    if (
      this.gravityDirection.equals(EARTH_GRAVITY) ||
      this.gravityDirection.equals(Vector.scale(EARTH_GRAVITY, -1))
    ) {
      c.velocity.y = velocity
    } else {
      c.velocity.x = velocity // Establece la componente vertical según la dirección de gravedad
    }
  }

  static handleHitXBoundary(c: Circle, dragFactor: number = 0.8) {
    if (c.position.x + c.radius > innerWidth) {
      c.position.x = innerWidth - c.radius
      c.velocity.x = -c.velocity.x * dragFactor
    } else if (c.position.x - c.radius < 0) {
      c.position.x = c.radius
      c.velocity.x = -c.velocity.x * dragFactor
    }
  }

  static hadlehitYBoundary(c: Circle, dragFactor: number = 0.8) {
    if (c.position.y + c.radius > innerHeight) {
      c.position.y = innerHeight - c.radius
      c.velocity.y = -c.velocity.y * dragFactor
    } else if (c.position.y - c.radius < 0) {
      c.position.y = c.radius
      c.velocity.y = -c.velocity.y * dragFactor
    }
  }

  changeGravityDirection() {
    while (true) {
      const g = this.randamGravityDirection()
      if (!this.gravityDirection.equals(g)) {
        this.gravityDirection = g
        break
      }
    }
  }

  private randamGravityDirection() {
    return CollisionHandler.gravityDirections[
      Math.floor(Math.random() * CollisionHandler.gravityDirections.length)
    ]
  }
}
