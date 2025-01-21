import { Proyectile } from '../types'

export class AirResistance {
  private dragCoefficient = -0.0024

  apply(p: Proyectile) {
    const dragMagnitude = p.velocity.magnitude() * this.dragCoefficient

    // Dirección opuesta a la velocidad
    const dragDirection = p.velocity.normalize()

    // Retornar el vector de resistencia al aire
    p.velocity = p.velocity.add(dragDirection.scale(dragMagnitude))
  }
}
