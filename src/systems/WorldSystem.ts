import Phaser from 'phaser'
import { WorldDimensions } from '../types/GameTypes'
import { GAME_CONFIG } from '../constants/GameConfig'
import { ASSET_KEYS } from '../constants/AssetKeys'

export class WorldSystem {
  private scene: Phaser.Scene
  private tiles: Phaser.GameObjects.Image[][] = []
  private worldDimensions: WorldDimensions = { width: 0, height: 0 }
  private dimOverlay?: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createGridWorld(): void {
    this.calculateWorldSize()
    this.destroyExistingTiles()
    this.generateTiles()
    this.createDimOverlay()
  }

  public createBackgroundWorld(backgroundKey: string): void {
    const backgroundImage = this.scene.add.image(
      this.scene.scale.width / 2, 
      this.scene.scale.height / 2, 
      backgroundKey
    )
    backgroundImage.setDisplaySize(this.scene.scale.width, this.scene.scale.height)
    this.createDimOverlay()
  }

  public getWorldDimensions(): WorldDimensions {
    return { ...this.worldDimensions }
  }

  public showDimOverlay(): void {
    if (this.dimOverlay) {
      this.dimOverlay.setVisible(true)
    }
  }

  public hideDimOverlay(): void {
    if (this.dimOverlay) {
      this.dimOverlay.setVisible(false)
    }
  }

  private calculateWorldSize(): void {
    const gameWidth = this.scene.scale.width
    const gameHeight = this.scene.scale.height
    
    this.worldDimensions.width = Math.floor(gameWidth / GAME_CONFIG.TILE_SIZE)
    this.worldDimensions.height = Math.floor(gameHeight / GAME_CONFIG.TILE_SIZE)
  }

  private destroyExistingTiles(): void {
    this.tiles.forEach(row => row.forEach(tile => tile.destroy()))
    this.tiles = []
  }

  private generateTiles(): void {
    for (let x = 0; x < this.worldDimensions.width; x++) {
      this.tiles[x] = []
      for (let y = 0; y < this.worldDimensions.height; y++) {
        let tileType = ASSET_KEYS.TILES.PAWGRASS
        
        // Border tiles
        if (x === 0 || x === this.worldDimensions.width - 1 || 
            y === 0 || y === this.worldDimensions.height - 1) {
          tileType = ASSET_KEYS.TILES.STONE
        }
        
        // Pattern-based stone tiles
        if ((x + y) % 12 === 0 && 
            x > 3 && x < this.worldDimensions.width - 4 && 
            y > 3 && y < this.worldDimensions.height - 4) {
          tileType = ASSET_KEYS.TILES.STONE
        }
        
        // Random stone tiles
        if (Math.random() < GAME_CONFIG.WORLD.STONE_FREQUENCY && 
            x > 5 && x < this.worldDimensions.width - 6 && 
            y > 5 && y < this.worldDimensions.height - 6) {
          tileType = ASSET_KEYS.TILES.STONE
        }
        
        const tile = this.scene.add.image(
          x * GAME_CONFIG.TILE_SIZE, 
          y * GAME_CONFIG.TILE_SIZE, 
          tileType
        ).setOrigin(0, 0)
        
        this.tiles[x][y] = tile
      }
    }
  }

  private createDimOverlay(): void {
    this.dimOverlay = this.scene.add.graphics()
    this.dimOverlay.setDepth(999)
    this.dimOverlay.setVisible(false)
    this.updateDimOverlay()
  }

  private updateDimOverlay(): void {
    if (this.dimOverlay) {
      this.dimOverlay.clear()
      this.dimOverlay.fillStyle(0x000000, 0.5)
      this.dimOverlay.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height)
    }
  }

  public handleResize(): void {
    this.updateDimOverlay()
  }

  public destroy(): void {
    this.destroyExistingTiles()
    if (this.dimOverlay) {
      this.dimOverlay.destroy()
    }
  }
}