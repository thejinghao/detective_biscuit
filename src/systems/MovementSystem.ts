import Phaser from 'phaser'
import { GridPosition, Direction, MovementOptions } from '../types/GameTypes'
import { GAME_CONFIG } from '../constants/GameConfig'
import { ANIMATION_KEYS } from '../constants/AssetKeys'

export class MovementSystem {
  private scene: Phaser.Scene
  private sprite: Phaser.GameObjects.Sprite
  private gridPosition: GridPosition
  private isMoving = false
  private facingDirection: Direction = 'up'
  
  constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite, initialPosition: GridPosition) {
    this.scene = scene
    this.sprite = sprite
    this.gridPosition = { ...initialPosition }
  }

  public moveToGrid(newPosition: GridPosition, options: MovementOptions = {}): Promise<void> {
    if (this.isMoving) {
      return Promise.resolve()
    }

    this.isMoving = true
    
    const direction = this.calculateDirection(this.gridPosition, newPosition)
    this.setFacingDirection(direction)
    
    this.gridPosition = { ...newPosition }
    
    const targetX = this.gridPosition.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
    const targetY = this.gridPosition.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2

    // Set sprite flip based on direction
    if (direction === 'left') {
      this.sprite.setFlipX(true)
    } else if (direction === 'right') {
      this.sprite.setFlipX(false)
    }

    this.sprite.play(ANIMATION_KEYS.BISCUIT_WALK)

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.sprite,
        x: targetX,
        y: targetY,
        duration: options.duration || GAME_CONFIG.ANIMATION.MOVEMENT_DURATION,
        ease: 'Power2',
        onComplete: () => {
          this.isMoving = false
          this.sprite.play(ANIMATION_KEYS.BISCUIT_IDLE)
          
          if (options.onComplete) {
            options.onComplete()
          }
          
          resolve()
        }
      })
    })
  }

  public canMoveTo(position: GridPosition, worldBounds: { width: number, height: number }): boolean {
    return position.x >= 1 && position.x <= worldBounds.width - 2 && 
           position.y >= 1 && position.y <= worldBounds.height - 2
  }

  public getGridPosition(): GridPosition {
    return { ...this.gridPosition }
  }

  public setGridPosition(position: GridPosition): void {
    this.gridPosition = { ...position }
    const targetX = this.gridPosition.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
    const targetY = this.gridPosition.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
    this.sprite.setPosition(targetX, targetY)
  }

  public getFacingDirection(): Direction {
    return this.facingDirection
  }

  public setFacingDirection(direction: Direction): void {
    this.facingDirection = direction
  }

  public isCurrentlyMoving(): boolean {
    return this.isMoving
  }

  private calculateDirection(from: GridPosition, to: GridPosition): Direction {
    if (to.x < from.x) return 'left'
    if (to.x > from.x) return 'right'
    if (to.y < from.y) return 'up'
    if (to.y > from.y) return 'down'
    return this.facingDirection // No movement, keep current direction
  }

  public destroy(): void {
    // Clean up any active tweens
    this.scene.tweens.killTweensOf(this.sprite)
  }
}