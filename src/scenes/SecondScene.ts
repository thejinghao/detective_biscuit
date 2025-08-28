import Phaser from 'phaser'
import { PlayerStats } from '../systems/PlayerStats'
import { SpeechBox } from '../systems/SpeechBox'

export class SecondScene extends Phaser.Scene {
  private biscuit!: Phaser.GameObjects.Sprite
  private gridX: number = 15
  private gridY: number = 10
  private tileSize: number = 32
  private isMoving: boolean = false
  private wasdKeys!: any
  private playerStats!: PlayerStats
  private speechBox!: SpeechBox
  private facingDirection: string = 'up'
  private backgroundImage!: Phaser.GameObjects.Image
  
  private healthBar!: Phaser.GameObjects.Graphics
  private manaBar!: Phaser.GameObjects.Graphics
  private healthText!: Phaser.GameObjects.Text
  private manaText!: Phaser.GameObjects.Text
  private levelText!: Phaser.GameObjects.Text
  private expText!: Phaser.GameObjects.Text
  private controlsText!: Phaser.GameObjects.Text
  private titleText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'SecondScene' })
  }

  create() {
    this.playerStats = new PlayerStats()
    this.speechBox = new SpeechBox(this)
    
    this.setupBackground()
    this.createUI()
    
    this.biscuit = this.add.sprite(
      this.gridX * this.tileSize + this.tileSize / 2,
      this.gridY * this.tileSize + this.tileSize / 2,
      'biscuit-walk1'
    )
    this.biscuit.setScale(0.5)
    this.biscuit.play('biscuit-idle')
    this.biscuit.setDepth(10)

    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D,SPACE,ENTER,T,C,P')

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start('MainMenuScene')
    })

    this.input.keyboard!.on('keydown-T', () => {
      if (!this.speechBox.isShowing()) {
        this.triggerRandomSpeech()
      }
    })

    this.input.keyboard!.on('keydown-OPEN_BRACKET', () => {
      this.scene.start('GameScene')
    })

    this.input.keyboard!.on('keydown-CLOSE_BRACKET', () => {
      this.scene.start('GameScene')
    })

    this.input.keyboard!.on('keydown-C', () => {
      if (!this.speechBox.isShowing()) {
        this.chewToiletPaper()
      }
    })

    this.input.keyboard!.on('keydown-P', () => {
      this.scene.start('FPSScene', { fromScene: 'SecondScene' })
    })

    this.showWelcomeMessage()
  }

  setupBackground() {
    this.backgroundImage = this.add.image(this.scale.width / 2, this.scale.height / 2, 'floor-bg')
    this.backgroundImage.setDisplaySize(this.scale.width, this.scale.height)
  }

  createUI() {
    this.destroyUI()
    
    const uiY = 20
    const barWidth = 200
    const barHeight = 20
    
    this.titleText = this.add.text(20, uiY, 'Detective Biscuit - Explore Room', {
      fontSize: '20px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.levelText = this.add.text(20, uiY + 35, '', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.add.text(20, uiY + 70, 'Health:', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.healthBar = this.add.graphics().setScrollFactor(0).setDepth(100)
    this.healthText = this.add.text(20 + barWidth + 10, uiY + 68, '', {
      fontSize: '14px',
      color: '#FFFFFF',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.add.text(20, uiY + 105, 'Mana:', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.manaBar = this.add.graphics().setScrollFactor(0).setDepth(100)
    this.manaText = this.add.text(20 + barWidth + 10, uiY + 103, '', {
      fontSize: '14px',
      color: '#FFFFFF',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.expText = this.add.text(20, uiY + 140, '', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)

    this.controlsText = this.add.text(20, 0, 'WASD: Move | T: Talk | C: Chew TP | P: FPS Game | [ ]: Navigate | ESC: Menu', {
      fontSize: '16px',
      color: '#FFD700',
      fontFamily: 'serif'
    }).setScrollFactor(0).setDepth(100)
    
    this.positionControlsText()
    this.updateUI()
  }

  destroyUI() {
    if (this.titleText) this.titleText.destroy()
    if (this.levelText) this.levelText.destroy()
    if (this.healthBar) this.healthBar.destroy()
    if (this.healthText) this.healthText.destroy()
    if (this.manaBar) this.manaBar.destroy()
    if (this.manaText) this.manaText.destroy()
    if (this.expText) this.expText.destroy()
    if (this.controlsText) this.controlsText.destroy()
  }

  positionControlsText() {
    if (this.controlsText) {
      this.controlsText.setPosition(20, this.scale.height - 60)
    }
  }

  updateUI() {
    const uiY = 20
    const barWidth = 200
    const barHeight = 20
    
    this.levelText.setText(`Level: ${this.playerStats.level}`)
    
    this.healthText.setText(`${this.playerStats.currentHealth}/${this.playerStats.maxHealth}`)
    this.manaText.setText(`${this.playerStats.currentMana}/${this.playerStats.maxMana}`)
    this.expText.setText(`XP: ${this.playerStats.experience}/${this.playerStats.getExpToNextLevel()}`)

    this.healthBar.clear()
    this.healthBar.fillStyle(0x3E372E)
    this.healthBar.fillRect(70, uiY + 60, barWidth, barHeight)
    this.healthBar.fillStyle(0xF24E5C)
    this.healthBar.fillRect(70, uiY + 60, barWidth * this.playerStats.getHealthPercentage(), barHeight)

    this.manaBar.clear()
    this.manaBar.fillStyle(0x3E372E)
    this.manaBar.fillRect(70, uiY + 90, barWidth, barHeight)
    this.manaBar.fillStyle(0x6A9F4D)
    this.manaBar.fillRect(70, uiY + 90, barWidth * this.playerStats.getManaPercentage(), barHeight)
  }

  update() {
    if (this.isMoving || this.speechBox.isShowing()) return

    let newX = this.gridX
    let newY = this.gridY
    let moved = false

    if (this.wasdKeys.A.isDown) {
      newX = this.gridX - 1
      this.facingDirection = 'left'
      moved = true
    } else if (this.wasdKeys.D.isDown) {
      newX = this.gridX + 1
      this.facingDirection = 'right'
      moved = true
    } else if (this.wasdKeys.W.isDown) {
      newY = this.gridY - 1
      this.facingDirection = 'up'
      moved = true
    } else if (this.wasdKeys.S.isDown) {
      newY = this.gridY + 1
      this.facingDirection = 'down'
      moved = true
    }

    if (moved && this.canMoveTo(newX, newY)) {
      this.moveToGrid(newX, newY)
    }
  }

  canMoveTo(x: number, y: number): boolean {
    const maxX = Math.floor(this.scale.width / this.tileSize) - 1
    const maxY = Math.floor(this.scale.height / this.tileSize) - 1
    return x >= 1 && x <= maxX - 1 && y >= 1 && y <= maxY - 1
  }

  moveToGrid(newX: number, newY: number) {
    this.isMoving = true
    
    const direction = newX < this.gridX ? 'left' : newX > this.gridX ? 'right' : 'none'
    
    this.gridX = newX
    this.gridY = newY

    const targetX = this.gridX * this.tileSize + this.tileSize / 2
    const targetY = this.gridY * this.tileSize + this.tileSize / 2

    if (direction === 'left') {
      this.biscuit.setFlipX(true)
    } else if (direction === 'right') {
      this.biscuit.setFlipX(false)
    }

    this.biscuit.play('biscuit-walk')

    this.tweens.add({
      targets: this.biscuit,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.isMoving = false
        this.biscuit.play('biscuit-idle')
        
        if (Math.random() < 0.15) {
          const leveledUp = this.playerStats.addExperience(10)
          this.updateUI()
          
          if (leveledUp) {
            this.triggerLevelUpSpeech()
          } else if (Math.random() < 0.3) {
            this.triggerMovementSpeech()
          }
        }
      }
    })
  }

  showWelcomeMessage() {
    setTimeout(() => {
      this.speechBox.show(
        "Biscuit", 
        "Wow! This explore room looks interesting! I can sense mysteries hidden everywhere!"
      )
    }, 1000)
  }

  triggerLevelUpSpeech() {
    const info = this.playerStats.getLastLevelUpInfo()
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

  triggerMovementSpeech() {
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

  triggerRandomSpeech() {
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

  chewToiletPaper() {
    const toiletPaper = this.add.image(this.biscuit.x, this.biscuit.y - 20, 'toilet-paper')
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
        
        setTimeout(() => {
          this.createPoopExplosion()
        }, 200)
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
      
      const leveledUp = this.playerStats.addExperience(15)
      this.updateUI()
      
      if (leveledUp) {
        setTimeout(() => {
          this.triggerLevelUpSpeech()
        }, 2000)
      }
    }, 800)
  }

  createPoopExplosion() {
    const explosionPoops: Phaser.GameObjects.Image[] = []
    const numPoops = 12
    
    for (let i = 0; i < numPoops; i++) {
      const angle = (360 / numPoops) * i
      const distance = Phaser.Math.Between(80, 150)
      
      const poop = this.add.image(this.biscuit.x, this.biscuit.y, 'poop')
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
          onComplete: () => {
            poop.destroy()
          }
        })
      })
      
      const chewedPaper = this.add.image(this.biscuit.x, this.biscuit.y - 30, 'toilet-paper-chewed')
      chewedPaper.setScale(0.2)
      chewedPaper.setDepth(17)
      
      this.tweens.add({
        targets: chewedPaper,
        y: chewedPaper.y + 50,
        alpha: 0.7,
        duration: 2000,
        ease: 'Power1',
        onComplete: () => {
          chewedPaper.destroy()
        }
      })
      
    }, 2000)
  }

  handleResize() {
    this.setupBackground()
    this.createUI()
    this.speechBox.resize()
  }
}