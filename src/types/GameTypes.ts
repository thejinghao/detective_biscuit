export interface WASDKeys {
  W: Phaser.Input.Keyboard.Key
  A: Phaser.Input.Keyboard.Key
  S: Phaser.Input.Keyboard.Key
  D: Phaser.Input.Keyboard.Key
  SPACE: Phaser.Input.Keyboard.Key
  ENTER: Phaser.Input.Keyboard.Key
  T: Phaser.Input.Keyboard.Key
  C: Phaser.Input.Keyboard.Key
  P: Phaser.Input.Keyboard.Key
}

export interface GridPosition {
  x: number
  y: number
}

export interface WorldDimensions {
  width: number
  height: number
}

export interface GameUIElements {
  healthBar: Phaser.GameObjects.Graphics
  manaBar: Phaser.GameObjects.Graphics
  healthText: Phaser.GameObjects.Text
  manaText: Phaser.GameObjects.Text
  levelText: Phaser.GameObjects.Text
  expText: Phaser.GameObjects.Text
  controlsText: Phaser.GameObjects.Text
  titleText: Phaser.GameObjects.Text
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface MovementOptions {
  duration?: number
  onComplete?: () => void
}

export interface SpeechMessage {
  speaker: string
  message: string
  typewriter?: boolean
}

export interface LevelUpInfo {
  level: number
  healthIncrease: number
  manaIncrease: number
}

export interface ResizableScene {
  handleResize(): void
}

export interface GameSystem {
  initialize(): void
  update?(delta: number): void
  destroy(): void
}