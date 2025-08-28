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

export class GameSceneRefactored extends BaseScene {
  private movementSystem!: MovementSystem
  private worldSystem!: WorldSystem
  private inputManager!: InputManager
  private uiManager!: UIManager
  private projectiles!: Phaser.GameObjects.Group

  constructor() {
    super(SCENE_KEYS.GAME)
  }

  protected setupScene(): void {
    this.setupCamera()
    this.worldSystem = new WorldSystem(this)
    this.worldSystem.createGridWorld()
    
    this.createPlayer()
    this.createProjectileSystem()
    this.setupManagers()
    this.showWelcomeMessage()
  }

  private setupCamera(): void {
    this.cameras.main.setScroll(0, 0)
    this.cameras.main.setZoom(1)
    this.cameras.main.setRoundPixels(true)
  }

  private createPlayer(): void {
    const worldDims = this.worldSystem.getWorldDimensions()
    const initialPos: GridPosition = {
      x: Math.floor(worldDims.width / 2),
      y: Math.floor(worldDims.height / 2)
    }

    this.biscuit = this.add.sprite(
      initialPos.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      initialPos.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      ASSET_KEYS.BISCUIT.WALK1
    )
    this.biscuit.setScale(GAME_CONFIG.PLAYER.DEFAULT_SCALE)
    this.biscuit.play('biscuit-idle')

    this.movementSystem = new MovementSystem(this, this.biscuit, initialPos)
  }

  private createProjectileSystem(): void {
    this.projectiles = this.add.group()
  }

  private setupManagers(): void {
    this.uiManager = new UIManager(this)
    this.uiManager.createPlayerUI(
      'Detective Biscuit',
      GAME_CONFIG.COLORS.TEXT_PRIMARY,
      'WASD: Move | SPACE: Fire | T: Talk | C: Chew TP | P: FPS Game | [ ]: Navigate | ESC: Menu',
      GAME_CONFIG.COLORS.CONTROLS_TEXT
    )

    this.inputManager = new InputManager(this)
    this.inputManager.setupMovementKeys((direction) => this.handleMovement(direction))
    this.inputManager.setupActionKeys({
      'SPACE': () => this.handleFireProjectile(),
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

    const worldDims = this.worldSystem.getWorldDimensions()
    if (this.movementSystem.canMoveTo(newPos, worldDims)) {
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

  private handleFireProjectile(): void {
    if (this.speechBox.isShowing()) return

    if (this.gameState.playerStats.useMana(GAME_CONFIG.COMBAT.MANA_COST)) {
      const projectile = this.add.image(this.biscuit.x, this.biscuit.y, ASSET_KEYS.PROJECTILES.OLIVE)
      projectile.setScale(GAME_CONFIG.COMBAT.PROJECTILE_SCALE)
      
      this.projectiles.add(projectile)
      
      let targetX = projectile.x
      const distance = GAME_CONFIG.COMBAT.PROJECTILE_DISTANCE
      const direction = this.movementSystem.getFacingDirection()
      
      switch (direction) {
        case 'up':
        case 'down':
        case 'left':
          targetX = projectile.x + distance
          break
        case 'right':
          targetX = projectile.x - distance
          break
      }
      
      this.tweens.add({
        targets: projectile,
        x: targetX,
        y: projectile.y,
        duration: GAME_CONFIG.COMBAT.PROJECTILE_SPEED,
        ease: 'Power2',
        onComplete: () => {
          const poop = this.add.image(targetX, projectile.y, ASSET_KEYS.PROJECTILES.POOP)
          poop.setScale(GAME_CONFIG.COMBAT.POOP_SCALE)
          poop.setDepth(1)
          
          projectile.destroy()
        }
      })
      
      this.updateUI()
    }
  }

  protected handleNavigationKey(): void {
    this.scene.start(SCENE_KEYS.SECOND)
  }

  protected triggerRandomSpeech(): void {
    const messages = [
      "Did you know I have the best nose for solving mysteries?",
      "I once solved the case of the missing treats in record time!",
      "Adventure is out there, and I'm going to find it!",
      "Every good detective needs to stay alert and observant.",
      "Want to hear about my latest case? It involved a very suspicious squirrel...",
      "The key to being a great detective is following your instincts!",
      "This world is full of secrets waiting to be uncovered!",
      "I may be small, but I have the heart of a true detective!",
      "Have you noticed how my expressions change when I talk? Pretty neat, right?",
      "Each conversation shows a different side of my detective personality!",
      "My facial expressions help convey the emotion behind each clue I discover.",
      "Sometimes I'm serious, sometimes playful - it all depends on the mystery!",
      "The art of conversation is just as important as the art of investigation!"
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    this.speechBox.show("Biscuit", randomMessage)
  }

  protected chewToiletPaper(): void {
    const toiletPaper = this.add.image(this.biscuit.x, this.biscuit.y - 20, ASSET_KEYS.UI.TOILET_PAPER)
    toiletPaper.setScale(0.3)
    toiletPaper.setDepth(5)

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
      "Mmm! This toilet paper is so satisfying to chew!",
      "*crunch crunch* Nothing beats a good roll of toilet paper!",
      "Woof! Detective work makes me hungry for paper!",
      "This is the best toilet paper I've had all day!",
      "*nom nom* Every detective needs their favorite snack!"
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
      poop.setDepth(6)
      
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
      chewedPaper.setDepth(7)
      
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
      `Amazing! I reached level ${info.level}! I feel stronger and more energetic!`,
      `Level up! My detective skills are getting sharper at level ${info.level}!`,
      `Woof woof! Level ${info.level} achieved! I'm becoming a master detective!`
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    setTimeout(() => {
      this.speechBox.show("Biscuit", randomMessage)
    }, 500)
  }

  private triggerMovementSpeech(): void {
    const messages = [
      "This grass feels nice under my paws!",
      "I wonder what mysteries await in this world...",
      "Sniff sniff... I smell adventure!",
      "My detective instincts are tingling!",
      "Every step brings new discoveries!",
      "I should investigate every corner of this place."
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    this.speechBox.show("Biscuit", randomMessage)
  }

  private showWelcomeMessage(): void {
    setTimeout(() => {
      this.speechBox.show(
        "Biscuit", 
        "Woof! I'm Detective Biscuit and I'm ready for adventure! Let's explore this mysterious world together!"
      )
    }, 1000)
  }

  protected updateUI(): void {
    this.uiManager.updatePlayerStats(this.gameState.playerStats)
  }

  protected getSceneTitle(): string {
    return 'Detective Biscuit'
  }

  protected getTextColor(): string {
    return GAME_CONFIG.COLORS.TEXT_PRIMARY
  }

  protected getControlsTextColor(): string {
    return GAME_CONFIG.COLORS.CONTROLS_TEXT
  }

  protected getControlsText(): string {
    return 'WASD: Move | SPACE: Fire | T: Talk | C: Chew TP | P: FPS Game | [ ]: Navigate | ESC: Menu'
  }

  update(): void {
    this.inputManager?.update()
  }

  public handleResize(): void {
    super.handleResize()
    this.setupCamera()
    
    const worldDims = this.worldSystem.getWorldDimensions()
    const centerPos: GridPosition = {
      x: Math.floor(worldDims.width / 2),
      y: Math.floor(worldDims.height / 2)
    }
    
    if (this.biscuit && this.movementSystem) {
      this.movementSystem.setGridPosition(centerPos)
    }
    
    this.worldSystem.createGridWorld()
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