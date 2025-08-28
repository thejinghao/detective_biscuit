import Phaser from 'phaser'
import { SCENE_KEYS } from '../constants/SceneKeys'
import { ASSET_KEYS } from '../constants/AssetKeys'

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU })
  }

  create() {
    this.cameras.main.setBackgroundColor('#FDF6E3')
    
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    this.add.text(centerX, centerY - 100, 'Detective Biscuit', {
      fontSize: '32px',
      color: '#353535',
      fontFamily: 'serif',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    const startButton = this.add.image(centerX, centerY, ASSET_KEYS.UI.START)
      .setOrigin(0.5)
      .setScale(0.25)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start(SCENE_KEYS.GAME)
      })
      .on('pointerover', () => {
        startButton.setScale(0.275)
        startButton.setTint(0x98C475)
      })
      .on('pointerout', () => {
        startButton.setScale(0.25)
        startButton.clearTint()
      })

  }
}