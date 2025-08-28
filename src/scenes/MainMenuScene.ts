import Phaser from 'phaser'

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' })
  }

  create() {
    this.cameras.main.setBackgroundColor('#FDF6E3')
    
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    const title = this.add.text(centerX, centerY - 100, 'Detective Biscuit', {
      fontSize: '32px',
      color: '#353535',
      fontFamily: 'serif',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    const startButton = this.add.image(centerX, centerY, 'ui-start')
      .setOrigin(0.5)
      .setScale(0.25)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('GameScene')
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