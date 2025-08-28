import Phaser from 'phaser'
import { PlayerStats } from '../systems/PlayerStats'
import { GameUIElements } from '../types/GameTypes'
import { GAME_CONFIG } from '../constants/GameConfig'

export class UIManager {
  private scene: Phaser.Scene
  private elements: Partial<GameUIElements> = {}

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  public createPlayerUI(
    title: string, 
    textColor: string, 
    controlsText: string, 
    controlsTextColor: string
  ): void {
    this.destroyAll()
    
    const { UI } = GAME_CONFIG
    
    this.elements.titleText = this.scene.add.text(UI.PADDING, UI.UI_Y, title, {
      fontSize: '20px',
      color: textColor,
      fontStyle: 'bold',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.elements.levelText = this.scene.add.text(UI.PADDING, UI.UI_Y + 35, '', {
      fontSize: '18px',
      color: textColor,
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.scene.add.text(UI.PADDING, UI.UI_Y + 70, 'Health:', {
      fontSize: '16px',
      color: textColor,
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.elements.healthBar = this.scene.add.graphics().setScrollFactor(0).setDepth(100)
    this.elements.healthText = this.scene.add.text(UI.PADDING + UI.BAR_WIDTH + 10, UI.UI_Y + 68, '', {
      fontSize: '14px',
      color: textColor,
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.scene.add.text(UI.PADDING, UI.UI_Y + 105, 'Mana:', {
      fontSize: '16px',
      color: textColor,
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.elements.manaBar = this.scene.add.graphics().setScrollFactor(0).setDepth(100)
    this.elements.manaText = this.scene.add.text(UI.PADDING + UI.BAR_WIDTH + 10, UI.UI_Y + 103, '', {
      fontSize: '14px',
      color: textColor,
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.elements.expText = this.scene.add.text(UI.PADDING, UI.UI_Y + 140, '', {
      fontSize: '16px',
      color: textColor,
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.elements.controlsText = this.scene.add.text(UI.PADDING, 0, controlsText, {
      fontSize: '16px',
      color: controlsTextColor,
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)
    
    this.positionControlsText()
  }

  public updatePlayerStats(stats: PlayerStats): void {
    const { UI, COLORS } = GAME_CONFIG
    
    if (this.elements.levelText) {
      this.elements.levelText.setText(`Level: ${stats.level}`)
    }
    
    if (this.elements.healthText) {
      this.elements.healthText.setText(`${stats.currentHealth}/${stats.maxHealth}`)
    }
    
    if (this.elements.manaText) {
      this.elements.manaText.setText(`${stats.currentMana}/${stats.maxMana}`)
    }
    
    if (this.elements.expText) {
      this.elements.expText.setText(`XP: ${stats.experience}/${stats.getExpToNextLevel()}`)
    }

    // Update health bar
    if (this.elements.healthBar) {
      this.elements.healthBar.clear()
      this.elements.healthBar.fillStyle(COLORS.BAR_BACKGROUND)
      this.elements.healthBar.fillRect(70, UI.UI_Y + 60, UI.BAR_WIDTH, UI.BAR_HEIGHT)
      this.elements.healthBar.fillStyle(COLORS.HEALTH_BAR)
      this.elements.healthBar.fillRect(70, UI.UI_Y + 60, UI.BAR_WIDTH * stats.getHealthPercentage(), UI.BAR_HEIGHT)
    }

    // Update mana bar
    if (this.elements.manaBar) {
      this.elements.manaBar.clear()
      this.elements.manaBar.fillStyle(COLORS.BAR_BACKGROUND)
      this.elements.manaBar.fillRect(70, UI.UI_Y + 90, UI.BAR_WIDTH, UI.BAR_HEIGHT)
      this.elements.manaBar.fillStyle(COLORS.MANA_BAR)
      this.elements.manaBar.fillRect(70, UI.UI_Y + 90, UI.BAR_WIDTH * stats.getManaPercentage(), UI.BAR_HEIGHT)
    }
  }

  public positionControlsText(): void {
    if (this.elements.controlsText) {
      this.elements.controlsText.setPosition(GAME_CONFIG.UI.PADDING, this.scene.scale.height - 60)
    }
  }

  public getElements(): Partial<GameUIElements> {
    return this.elements
  }

  public destroyAll(): void {
    Object.values(this.elements).forEach(element => {
      if (element && element.destroy) {
        element.destroy()
      }
    })
    this.elements = {}
  }

  public destroy(): void {
    this.destroyAll()
  }
}