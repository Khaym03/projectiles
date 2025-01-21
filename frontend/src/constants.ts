import { Vector } from './vector'

export const PIXELS_PER_METER = 20 // 1 metro = 100 píxeles

export const FOOTBALL = Object.freeze({
  radius: 0.7 * PIXELS_PER_METER, // metetrs
  mass: 0.45 // kg
})

export const FPS = 60

export const METER_PER_SECOND = PIXELS_PER_METER / FPS // m/s

export const EARTH_GRAVITY = Object.freeze(new Vector(0, 9.81 / FPS)) // m/s^2
