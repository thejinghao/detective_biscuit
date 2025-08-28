import Phaser from 'phaser'
import { BaseScene } from './BaseScene'
import { MovementSystem } from '../systems/MovementSystem'
import { WorldSystem } from '../systems/WorldSystem'
import { InputManager } from '../managers/InputManager'
import { UIManager } from '../managers/UIManager'
import { Direction, GridPosition } from '../types/GameTypes'
import { GAME_CONFIG } from '../constants/GameConfig'
import { ASSET_KEYS } from '../constants/AssetKeys'
import { SCENE_KEYS } from '../constants/SceneKeys'

export class SecondSceneRefactored extends BaseScene {
  private movementSystem!: MovementSystem
  private worldSystem!: WorldSystem
  private inputManager!: InputManager
  private uiManager!: UIManager

  constructor() {
    super(SCENE_KEYS.SECOND)
  }

  protected setupScene(): void {
    this.worldSystem = new WorldSystem(this)
    this.worldSystem.createBackgroundWorld(ASSET_KEYS.BACKGROUNDS.FLOOR)
    
    this.createPlayer()
    this.setupManagers()
    this.showWelcomeMessage()
  }

  private createPlayer(): void {
    const initialPos: GridPosition = {
      x: GAME_CONFIG.PLAYER.INITIAL_GRID_X_SECOND,
      y: GAME_CONFIG.PLAYER.INITIAL_GRID_Y_SECOND
    }

    this.biscuit = this.add.sprite(
      initialPos.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      initialPos.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      ASSET_KEYS.BISCUIT.WALK1
    )
    this.biscuit.setScale(GAME_CONFIG.PLAYER.DEFAULT_SCALE)
    this.biscuit.play('biscuit-idle')
    this.biscuit.setDepth(10)

    this.movementSystem = new MovementSystem(this, this.biscuit, initialPos)
  }

  private setupManagers(): void {
    this.uiManager = new UIManager(this)
    this.uiManager.createPlayerUI(
      'Detective Biscuit - Explore Room',
      GAME_CONFIG.COLORS.TEXT_WHITE,
      'WASD: Move | T: Talk | C: Chew TP | P: FPS Game | [ ]: Navigate | ESC: Menu',
      GAME_CONFIG.COLORS.TEXT_GOLD
    )

    this.inputManager = new InputManager(this)
    this.inputManager.setupMovementKeys((direction) => this.handleMovement(direction))
    this.inputManager.setupActionKeys({
      'OPEN_BRACKET': () => this.handleNavigationKey(),
      'CLOSE_BRACKET': () => this.handleNavigationKey()
    })

    this.updateUI()
  }

  private async handleMovement(direction: Direction): Promise<void> {
    if (this.movementSystem.isCurrentlyMoving() || this.speechBox.isShowing()) {
      return
    }

    const currentPos = this.movementSystem.getGridPosition()
    const newPos: GridPosition = { ...currentPos }

    switch (direction) {
      case 'left':
        newPos.x--
        break
      case 'right':
        newPos.x++
        break
      case 'up':
        newPos.y--
        break
      case 'down':
        newPos.y++
        break
    }

    const maxX = Math.floor(this.scale.width / GAME_CONFIG.TILE_SIZE) - 1
    const maxY = Math.floor(this.scale.height / GAME_CONFIG.TILE_SIZE) - 1
    const worldBounds = { width: maxX + 1, height: maxY + 1 }

    if (this.movementSystem.canMoveTo(newPos, worldBounds)) {
      this.movementSystem.setFacingDirection(direction)
      
      await this.movementSystem.moveToGrid(newPos, {
        onComplete: () => {
          if (Math.random() < GAME_CONFIG.WORLD.RANDOM_SPEECH_CHANCE) {
            const leveledUp = this.gameState.playerStats.addExperience(GAME_CONFIG.COMBAT.EXP_GAIN_MOVE)
            this.updateUI()
            
            if (leveledUp) {
              this.triggerLevelUpSpeech()
            } else if (Math.random() < GAME_CONFIG.WORLD.MOVEMENT_SPEECH_CHANCE) {
              this.triggerMovementSpeech()
            }
          }
        }
      })
    }
  }

  protected handleNavigationKey(): void {
    this.scene.start(SCENE_KEYS.GAME)
  }

  protected triggerRandomSpeech(): void {
    const messages = [
      "This explore room is perfect for solving mysteries!",
      "The mountain view reminds me of grand adventures!",
      "I love how the sun shines differently here than in the grass field!",
      "Every good detective needs to explore different environments.",
      "Want to hear about the time I tracked clues through various rooms?",
      "Different places reveal different types of mysteries!",
      "This room has its own unique detective challenges!",
      "I can sense that important clues might be hidden here!",
      "The landscape here tells its own story of adventure!",
      "Each room I explore adds to my detective experience!"
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    this.speechBox.show("Biscuit", randomMessage)
  }

  protected chewToiletPaper(): void {
    const toiletPaper = this.add.image(this.biscuit.x, this.biscuit.y - 20, ASSET_KEYS.UI.TOILET_PAPER)
    toiletPaper.setScale(0.3)
    toiletPaper.setDepth(15)

    this.biscuit.play('biscuit-walk')

    this.tweens.add({
      targets: toiletPaper,
      scaleX: 0.1,
      scaleY: 0.1,
      alpha: 0.3,
      angle: 360,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        toiletPaper.destroy()
        setTimeout(() => this.createPoopExplosion(), 200)
      }
    })

    const chewMessages = [
      "Mmm! This toilet paper tastes even better in this room!",
      "*crunch crunch* The floor room makes everything more flavorful!",
      "Woof! Exploring new rooms works up an appetite for paper!",
      "This toilet paper has a different texture here - I love it!",
      "*nom nom* Each room adds its own flavor to my favorite snack!"
    ]
    const randomMessage = chewMessages[Math.floor(Math.random() * chewMessages.length)]
    
    setTimeout(() => {
      this.biscuit.play('biscuit-idle')
      this.speechBox.show("Biscuit", randomMessage)
      
      const leveledUp = this.gameState.playerStats.addExperience(GAME_CONFIG.COMBAT.EXP_GAIN_CHEW)
      this.updateUI()
      
      if (leveledUp) {
        setTimeout(() => this.triggerLevelUpSpeech(), 2000)
      }
    }, 800)
  }

  private createPoopExplosion(): void {
    const explosionPoops: Phaser.GameObjects.Image[] = []
    const numPoops = 12
    
    for (let i = 0; i < numPoops; i++) {
      const angle = (360 / numPoops) * i
      const distance = Phaser.Math.Between(80, 150)
      
      const poop = this.add.image(this.biscuit.x, this.biscuit.y, ASSET_KEYS.PROJECTILES.POOP)
      poop.setScale(Phaser.Math.Between(8, 15) / 100)
      poop.setDepth(16)
      
      const targetX = this.biscuit.x + Math.cos(Phaser.Math.DegToRad(angle)) * distance
      const targetY = this.biscuit.y + Math.sin(Phaser.Math.DegToRad(angle)) * distance
      
      this.tweens.add({
        targets: poop,
        x: targetX,
        y: targetY,
        angle: Phaser.Math.Between(-180, 180),
        duration: 300,
        ease: 'Power2'
      })
      
      explosionPoops.push(poop)
    }
    
    setTimeout(() => {
      explosionPoops.forEach(poop => {
        this.tweens.add({
          targets: poop,
          alpha: 0,
          duration: 500,
          onComplete: () => poop.destroy()
        })
      })
      
      const chewedPaper = this.add.image(this.biscuit.x, this.biscuit.y - 30, ASSET_KEYS.UI.TOILET_PAPER_CHEWED)
      chewedPaper.setScale(0.2)
      chewedPaper.setDepth(17)
      
      this.tweens.add({
        targets: chewedPaper,
        y: chewedPaper.y + 50,
        alpha: 0.7,
        duration: 2000,
        ease: 'Power1',
        onComplete: () => chewedPaper.destroy()
      })
    }, 2000)
  }

  private triggerLevelUpSpeech(): void {
    const info = this.gameState.playerStats.getLastLevelUpInfo()
    const messages = [
      `Amazing! I reached level ${info.level} in this mysterious room!`,
      `Level up! My detective skills are growing stronger at level ${info.level}!`,
      `Woof woof! Level ${info.level} achieved in the explore room!`
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    setTimeout(() => {
      this.speechBox.show("Biscuit", randomMessage)
    }, 500)
  }

  private triggerMovementSpeech(): void {
    const messages = [
      "This room has such an interesting atmosphere!",
      "I wonder what secrets this place holds...",
      "The colors here are so different from the grass field!",
      "My detective nose is picking up new scents!",
      "This explore room feels full of adventure!",
      "I should investigate every corner of this mysterious place."
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    this.speechBox.show("Biscuit", randomMessage)
  }

  private showWelcomeMessage(): void {
    setTimeout(() => {
      this.speechBox.show(
        "Biscuit", 
        "Wow! This explore room looks interesting! I can sense mysteries hidden everywhere!"
      )
    }, 1000)
  }

  protected updateUI(): void {
    this.uiManager.updatePlayerStats(this.gameState.playerStats)
  }

  protected getSceneTitle(): string {
    return 'Detective Biscuit - Explore Room'
  }

  protected getTextColor(): string {
    return GAME_CONFIG.COLORS.TEXT_WHITE
  }

  protected getControlsTextColor(): string {
    return GAME_CONFIG.COLORS.TEXT_GOLD
  }

  protected getControlsText(): string {
    return 'WASD: Move | T: Talk | C: Chew TP | P: FPS Game | [ ]: Navigate | ESC: Menu'
  }

  update(): void {
    this.inputManager?.update()
  }

  public handleResize(): void {
    super.handleResize()
    this.worldSystem.createBackgroundWorld(ASSET_KEYS.BACKGROUNDS.FLOOR)
    this.uiManager?.positionControlsText()
  }

  protected cleanupListeners(): void {
    super.cleanupListeners()
    this.inputManager?.cleanup()
  }

  destroy() {
    this.movementSystem?.destroy()
    this.worldSystem?.destroy()
    this.inputManager?.destroy()
    this.uiManager?.destroy()
    super.destroy()
  }
}