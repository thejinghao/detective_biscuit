import Phaser from 'phaser'
import { WASDKeys, Direction } from '../types/GameTypes'

export class InputManager {
  private scene: Phaser.Scene
  private wasdKeys: WASDKeys
  private actionCallbacks: Map<string, () => void> = new Map()
  private movementCallback?: (direction: Direction) => void

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.wasdKeys = scene.input.keyboard!.addKeys('W,S,A,D,SPACE,ENTER,T,C,P') as WASDKeys
  }

  public setupMovementKeys(callback: (direction: Direction) => void): void {
    this.movementCallback = callback
  }

  public setupActionKey(key: string, callback: () => void): void {
    this.actionCallbacks.set(key, callback)
    this.scene.input.keyboard!.on(`keydown-${key}`, callback)
  }

  public setupActionKeys(actions: Record<string, () => void>): void {
    Object.entries(actions).forEach(([key, callback]) => {
      this.setupActionKey(key, callback)
    })
  }

  public update(): void {
    if (!this.movementCallback) return

    if (this.wasdKeys.A.isDown) {
      this.movementCallback('left')
    } else if (this.wasdKeys.D.isDown) {
      this.movementCallback('right')
    } else if (this.wasdKeys.W.isDown) {
      this.movementCallback('up')
    } else if (this.wasdKeys.S.isDown) {
      this.movementCallback('down')
    }
  }

  public isKeyDown(key: keyof WASDKeys): boolean {
    return this.wasdKeys[key].isDown
  }

  public isMovementKeyDown(): boolean {
    return this.wasdKeys.W.isDown || this.wasdKeys.A.isDown || 
           this.wasdKeys.S.isDown || this.wasdKeys.D.isDown
  }

  public cleanup(): void {
    this.actionCallbacks.forEach((callback, key) => {
      this.scene.input.keyboard!.off(`keydown-${key}`, callback)
    })
    this.actionCallbacks.clear()
    this.movementCallback = undefined
  }

  public destroy(): void {
    this.cleanup()
  }
}