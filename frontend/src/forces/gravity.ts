import { Vector } from '../vector'
import { Proyectile } from '../types'
import { EARTH_GRAVITY, FPS } from '@/constants'

export class GravityForce {
    private gravity: Vector = EARTH_GRAVITY
    
    apply(entity: Proyectile) {
        entity.velocity = entity.velocity.add(this.gravity)
    }

    getGravity() {
        return this.gravity
    }

    setGravity(gravity: Vector) {
        this.gravity = gravity
    }

    setGravityMagnitude(magnitude: number) {
        this.gravity = new Vector(0, magnitude / FPS)
    }
}