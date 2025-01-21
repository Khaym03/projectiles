import { Circle } from './circle'

export class Friction {
  constructor(private coefficient: number) {}

  apply(c: Circle) {
    const normalForce = c.mass * c.gravity.y // Fuerza normal (peso)
    const frictionForce = this.coefficient * normalForce // Fuerza de fricción

    if (Math.abs(c.velocity.x) > 0) {
      const frictionAcceleration = frictionForce / c.mass

      if (Math.abs(c.velocity.x) > frictionAcceleration) {
        if (c.velocity.x > 0) {
          c.velocity.x -= frictionAcceleration // Reducir velocidad por fricción hacia la derecha
        } else {
          c.velocity.x += frictionAcceleration // Reducir velocidad por fricción hacia la izquierda
        }
      } else {
        c.velocity.x = 0 // Detener el objeto si la fricción es suficiente para detenerlo
      }
    }
  }
}
