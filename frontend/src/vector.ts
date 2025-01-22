export class Vector {
  constructor(public x: number, public y: number) {}

  // Sumar otro vector
  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  static add(p1: Vector, p2: Vector): Vector {
    return new Vector(p1.x + p2.x, p1.y + p2.y)
  }

  subtract(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y)
  }

  static subtract(p1: Vector, p2: Vector): Vector {
    return new Vector(p1.x - p2.x, p1.y - p2.y)
  }


  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y
  }

  static dot(p1: Vector, p2: Vector): number {
    return p1.x * p2.x + p1.y * p2.y
  }

  // Invertir el vector (cambiar dirección)
  invert(): Vector {
    return new Vector(-this.x, -this.y)
  }

  invertHorizontal(): Vector {
    return new Vector(-this.x, this.y)
  }
  invertVertical(): Vector {
    return new Vector(this.x, -this.y)
  }

  scale(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  static scale(p: Vector, scalar: number): Vector {
    return new Vector(p.x * scalar, p.y * scalar)
  }

  // Obtener la magnitud del vector
  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  normalize(): Vector {
    const magnitude = this.magnitude()
    return new Vector(this.x / magnitude, this.y / magnitude)
  }

  // Rotar el vector por un ángulo en radianes
  rotate(angle: number): Vector {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos)
  }

  angle(): number {
    return Math.atan2(this.y, this.x)
  }

  static angleBetween(p1: Vector, p2: Vector): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }

  // Método para crear un vector a partir de magnitud y ángulo
  static fromPolar(magnitude: number, angle: number): Vector {
    const x = magnitude * Math.cos(angle)
    const y = magnitude * Math.sin(angle)
    return new Vector(x, y)
  }

  static distance(a: Vector, b: Vector): number {
    const x = b.x - a.x
    const y = b.y - a.y
    return Math.sqrt(x ** 2 + y ** 2)
  }

  static angle(a: Vector, b: Vector): number {
    const x = b.x - a.x
    const y = b.y - a.y
    return Math.atan2(y, x)
  }

  equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y
  }
}
