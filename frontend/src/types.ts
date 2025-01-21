import { Circle } from "./circle"
import { Vector } from "./vector"

export interface Entity {
    update(): void
    draw(): void
    position: Vector
}

export interface BounceVertical {
    bounceVertical(c:Circle): void
}

export interface Proyectile {
    position: Vector
    velocity: Vector
    mass: number
}


