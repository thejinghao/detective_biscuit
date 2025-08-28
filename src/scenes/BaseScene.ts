import Phaser from 'phaser'
import { GameStateManager } from '../managers/GameStateManager'
import { SpeechBox } from '../systems/SpeechBox'
import { GameUIElements, WASDKeys, Direction, ResizableScene } from '../types/GameTypes'
import { GAME_CONFIG } from '../constants/GameConfig'

export abstract class BaseScene extends Phaser.Scene implements ResizableScene {
  protected gameState: GameStateManager
  protected speechBox!: SpeechBox
  protected uiElements!: Partial<GameUIElements>
  protected wasdKeys!: WASDKeys
  
  protected biscuit!: Phaser.GameObjects.Sprite
  protected gridX: number = 0
  protected gridY: number = 0
  protected isMoving: boolean = false
  protected facingDirection: Direction = 'up'

  constructor(key: string) {
    super({ key })
    this.gameState = GameStateManager.getInstance()
  }

  create() {
    this.gameState.setCurrentScene(this.scene.key)
    this.speechBox = new SpeechBox(this)
    this.setupInput()
    this.setupScene()
    this.createUI()
  }

  protected abstract setupScene(): void
  
  protected setupInput(): void {
    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D,SPACE,ENTER,T,C,P') as WASDKeys

    this.input.keyboard!.on('keydown-ESC', this.handleEscapeKey, this)
    this.input.keyboard!.on('keydown-T', this.handleTalkKey, this)
    this.input.keyboard!.on('keydown-C', this.handleChewKey, this)
    this.input.keyboard!.on('keydown-P', this.handleFPSKey, this)
    this.input.keyboard!.on('keydown-OPEN_BRACKET', this.handleNavigationKey, this)
    this.input.keyboard!.on('keydown-CLOSE_BRACKET', this.handleNavigationKey, this)
  }

  protected createUI(): void {
    this.destroyUI()
    
    const { UI, COLORS } = GAME_CONFIG
    
    this.uiElements.titleText = this.add.text(UI.PADDING, UI.UI_Y, this.getSceneTitle(), {
      fontSize: '20px',
      color: this.getTextColor(),
      fontStyle: 'bold',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.uiElements.levelText = this.add.text(UI.PADDING, UI.UI_Y + 35, '', {
      fontSize: '18px',
      color: this.getTextColor(),
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.add.text(UI.PADDING, UI.UI_Y + 70, 'Health:', {
      fontSize: '16px',
      color: this.getTextColor(),
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.uiElements.healthBar = this.add.graphics().setScrollFactor(0).setDepth(100)
    this.uiElements.healthText = this.add.text(UI.PADDING + UI.BAR_WIDTH + 10, UI.UI_Y + 68, '', {
      fontSize: '14px',
      color: this.getTextColor(),
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.add.text(UI.PADDING, UI.UI_Y + 105, 'Mana:', {
      fontSize: '16px',
      color: this.getTextColor(),
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.uiElements.manaBar = this.add.graphics().setScrollFactor(0).setDepth(100)
    this.uiElements.manaText = this.add.text(UI.PADDING + UI.BAR_WIDTH + 10, UI.UI_Y + 103, '', {
      fontSize: '14px',
      color: this.getTextColor(),
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.uiElements.expText = this.add.text(UI.PADDING, UI.UI_Y + 140, '', {
      fontSize: '16px',
      color: this.getTextColor(),
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.uiElements.controlsText = this.add.text(UI.PADDING, 0, this.getControlsText(), {
      fontSize: '16px',
      color: this.getControlsTextColor(),
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)
    
    this.positionControlsText()
    this.updateUI()
  }

  protected updateUI(): void {
    const { UI, COLORS } = GAME_CONFIG
    const stats = this.gameState.playerStats
    
    if (this.uiElements.levelText) {
      this.uiElements.levelText.setText(`Level: ${stats.level}`)
    }
    
    if (this.uiElements.healthText) {
      this.uiElements.healthText.setText(`${stats.currentHealth}/${stats.maxHealth}`)
    }
    
    if (this.uiElements.manaText) {
      this.uiElements.manaText.setText(`${stats.currentMana}/${stats.maxMana}`)
    }
    
    if (this.uiElements.expText) {
      this.uiElements.expText.setText(`XP: ${stats.experience}/${stats.getExpToNextLevel()}`)
    }

    if (this.uiElements.healthBar) {
      this.uiElements.healthBar.clear()
      this.uiElements.healthBar.fillStyle(COLORS.BAR_BACKGROUND)
      this.uiElements.healthBar.fillRect(70, UI.UI_Y + 60, UI.BAR_WIDTH, UI.BAR_HEIGHT)
      this.uiElements.healthBar.fillStyle(COLORS.HEALTH_BAR)
      this.uiElements.healthBar.fillRect(70, UI.UI_Y + 60, UI.BAR_WIDTH * stats.getHealthPercentage(), UI.BAR_HEIGHT)
    }

    if (this.uiElements.manaBar) {
      this.uiElements.manaBar.clear()
      this.uiElements.manaBar.fillStyle(COLORS.BAR_BACKGROUND)
      this.uiElements.manaBar.fillRect(70, UI.UI_Y + 90, UI.BAR_WIDTH, UI.BAR_HEIGHT)
      this.uiElements.manaBar.fillStyle(COLORS.MANA_BAR)
      this.uiElements.manaBar.fillRect(70, UI.UI_Y + 90, UI.BAR_WIDTH * stats.getManaPercentage(), UI.BAR_HEIGHT)
    }
  }

  protected destroyUI(): void {
    Object.values(this.uiElements || {}).forEach(element => {
      if (element && element.destroy) {
        element.destroy()
      }
    })
    this.uiElements = {}
  }

  protected positionControlsText(): void {
    if (this.uiElements.controlsText) {
      this.uiElements.controlsText.setPosition(GAME_CONFIG.UI.PADDING, this.scale.height - 60)
    }
  }

  protected handleEscapeKey(): void {
    this.scene.start('MainMenuScene')
  }

  protected handleTalkKey(): void {
    if (!this.speechBox.isShowing()) {
      this.triggerRandomSpeech()
    }
  }

  protected handleChewKey(): void {
    if (!this.speechBox.isShowing()) {
      this.chewToiletPaper()
    }
  }

  protected handleFPSKey(): void {
    this.scene.start('FPSScene', { fromScene: this.scene.key })
  }

  protected abstract handleNavigationKey(): void
  protected abstract triggerRandomSpeech(): void
  protected abstract chewToiletPaper(): void
  protected abstract getSceneTitle(): string
  protected abstract getTextColor(): string
  protected abstract getControlsTextColor(): string
  protected abstract getControlsText(): string

  public handleResize(): void {
    this.createUI()
    this.speechBox.resize()
    this.positionControlsText()
  }

  protected cleanupListeners(): void {
    this.input.keyboard!.off('keydown-ESC', this.handleEscapeKey, this)
    this.input.keyboard!.off('keydown-T', this.handleTalkKey, this)
    this.input.keyboard!.off('keydown-C', this.handleChewKey, this)
    this.input.keyboard!.off('keydown-P', this.handleFPSKey, this)
    this.input.keyboard!.off('keydown-OPEN_BRACKET', this.handleNavigationKey, this)
    this.input.keyboard!.off('keydown-CLOSE_BRACKET', this.handleNavigationKey, this)
  }

  destroy() {
    this.cleanupListeners()
    this.destroyUI()
    this.speechBox?.destroy()
    super.destroy()
  }
}