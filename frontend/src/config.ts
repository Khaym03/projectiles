export default class Config {
  showGravityArrow = false
  showVelocityArrow = false
  showBackgorundPlane = false
  showCenterOfThePlane = false
  showParticles = false
  showStats = false

  colideHorizontal = false
  colisionVertical = false
  groundCollision = false

  playMusic = false
  
  allowBlasters = false
  allowGravityChange = false


  gameMode: appMode = "simulation"

}

type appMode = "simulation" | "game"

const physicsSimulationConfig = new Config()
physicsSimulationConfig.showGravityArrow = true
physicsSimulationConfig.showVelocityArrow = true
physicsSimulationConfig.showBackgorundPlane = true
physicsSimulationConfig.showCenterOfThePlane = true
physicsSimulationConfig.colideHorizontal = true
physicsSimulationConfig.groundCollision = true
physicsSimulationConfig.colisionVertical = true
physicsSimulationConfig.showStats = true

const gameConfig = new Config()
gameConfig.showGravityArrow = false
gameConfig.showVelocityArrow = false

// Por arreglar bug que deja una especie de sombra en el fondo
gameConfig.showStats = true

gameConfig.colideHorizontal = true
gameConfig.groundCollision = true
gameConfig.colisionVertical = true
gameConfig.playMusic = true
gameConfig.showParticles = true
gameConfig.allowBlasters = true
gameConfig.allowGravityChange = true
gameConfig.gameMode = 'game'

export { physicsSimulationConfig, gameConfig }
