import Phaser from 'phaser'
import { PlayerStats } from '../systems/PlayerStats'
import { SpeechBox } from '../systems/SpeechBox'

export class GameScene extends Phaser.Scene {
  private biscuit!: Phaser.GameObjects.Sprite
  private gridX: number = 25
  private gridY: number = 15
  private tileSize: number = 32
  private isMoving: boolean = false
  private wasdKeys!: any
  private playerStats!: PlayerStats
  private speechBox!: SpeechBox
  private facingDirection: string = 'up'
  
  private worldWidth!: number
  private worldHeight!: number
  private tiles: Phaser.GameObjects.Image[][] = []
  private dimOverlay!: Phaser.GameObjects.Graphics
  private projectiles!: Phaser.GameObjects.Group
  
  private healthBar!: Phaser.GameObjects.Graphics
  private manaBar!: Phaser.GameObjects.Graphics
  private healthText!: Phaser.GameObjects.Text
  private manaText!: Phaser.GameObjects.Text
  private levelText!: Phaser.GameObjects.Text
  private expText!: Phaser.GameObjects.Text
  private controlsText!: Phaser.GameObjects.Text
  private titleText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.playerStats = new PlayerStats()
    this.speechBox = new SpeechBox(this)
    this.setupCamera()
    this.calculateWorldSize()
    this.createGridWorld()
    this.createDimOverlay()
    this.createProjectileSystem()
    this.createUI()
    
    this.biscuit = this.add.sprite(
      this.gridX * this.tileSize + this.tileSize / 2,
      this.gridY * this.tileSize + this.tileSize / 2,
      'biscuit-walk1'
    )
    this.biscuit.setScale(0.5)
    this.biscuit.play('biscuit-idle')

    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D,SPACE,ENTER,T,C,P')

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start('MainMenuScene')
    })

    this.input.keyboard!.on('keydown-SPACE', () => {
      if (!this.speechBox.isShowing()) {
        this.fireProjectile()
      }
    })

    this.input.keyboard!.on('keydown-T', () => {
      if (!this.speechBox.isShowing()) {
        this.triggerRandomSpeech()
      }
    })

    this.input.keyboard!.on('keydown-OPEN_BRACKET', () => {
      this.scene.start('SecondScene')
    })

    this.input.keyboard!.on('keydown-CLOSE_BRACKET', () => {
      this.scene.start('SecondScene')
    })

    this.input.keyboard!.on('keydown-C', () => {
      if (!this.speechBox.isShowing()) {
        this.chewToiletPaper()
      }
    })

    this.input.keyboard!.on('keydown-P', () => {
      this.scene.start('FPSScene', { fromScene: 'GameScene' })
    })

    this.showWelcomeMessage()
  }

  setupCamera() {
    this.cameras.main.setScroll(0, 0)
    this.cameras.main.setZoom(1)
    this.cameras.main.setRoundPixels(true)
  }

  calculateWorldSize() {
    const gameWidth = this.scale.width
    const gameHeight = this.scale.height
    
    this.worldWidth = Math.floor(gameWidth / this.tileSize)
    this.worldHeight = Math.floor(gameHeight / this.tileSize)
    
    this.gridX = Math.floor(this.worldWidth / 2)
    this.gridY = Math.floor(this.worldHeight / 2)
  }

  createGridWorld() {
    this.tiles.forEach(row => row.forEach(tile => tile.destroy()))
    this.tiles = []
    
    for (let x = 0; x < this.worldWidth; x++) {
      this.tiles[x] = []
      for (let y = 0; y < this.worldHeight; y++) {
        let tileType = 'pawgrass-tile'
        
        if (x === 0 || x === this.worldWidth - 1 || y === 0 || y === this.worldHeight - 1) {
          tileType = 'stone-tile'
        }
        
        if ((x + y) % 12 === 0 && x > 3 && x < this.worldWidth - 4 && y > 3 && y < this.worldHeight - 4) {
          tileType = 'stone-tile'
        }
        
        if (Math.random() < 0.05 && x > 5 && x < this.worldWidth - 6 && y > 5 && y < this.worldHeight - 6) {
          tileType = 'stone-tile'
        }
        
        this.tiles[x][y] = this.add.image(x * this.tileSize, y * this.tileSize, tileType).setOrigin(0, 0)
      }
    }
  }

  createDimOverlay() {
    this.dimOverlay = this.add.graphics()
    this.dimOverlay.setDepth(999)
    this.dimOverlay.setVisible(false)
    this.updateDimOverlay()
  }

  updateDimOverlay() {
    if (this.dimOverlay) {
      this.dimOverlay.clear()
      this.dimOverlay.fillStyle(0x000000, 0.5)
      this.dimOverlay.fillRect(0, 0, this.scale.width, this.scale.height)
    }
  }

  createProjectileSystem() {
    this.projectiles = this.add.group()
  }

  fireProjectile() {
    if (this.playerStats.useMana(10)) {
      const projectile = this.add.image(this.biscuit.x, this.biscuit.y, 'olive-projectile')
      projectile.setScale(0.05)  // 10% of current size (0.5 * 0.1 = 0.05)
      
      this.projectiles.add(projectile)
      
      let targetX = projectile.x
      let targetY = projectile.y
      const distance = 200
      
      // Calculate target position - fire away from character horizontally
      switch (this.facingDirection) {
        case 'up':
        case 'down':
        case 'left':
          // If facing left (or up/down), fire right (away from character)
          targetX = projectile.x + distance
          break
        case 'right':
          // If facing right, fire left (away from character)
          targetX = projectile.x - distance
          break
      }
      
      this.tweens.add({
        targets: projectile,
        x: targetX,
        y: targetY,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          // Create poop at impact location
          const poop = this.add.image(targetX, targetY, 'poop')
          poop.setScale(0.05)  // 5% size
          poop.setDepth(1)  // Above ground tiles but below character
          
          projectile.destroy()
        }
      })
      
      this.updateUI()
    }
  }

  chewToiletPaper() {
    const toiletPaper = this.add.image(this.biscuit.x, this.biscuit.y - 20, 'toilet-paper')
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
        
        setTimeout(() => {
          this.createPoopExplosion()
        }, 200)
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
          onComplete: () => {
            poop.destroy()
          }
        })
      })
      
      const chewedPaper = this.add.image(this.biscuit.x, this.biscuit.y - 30, 'toilet-paper-chewed')
      chewedPaper.setScale(0.2)
      chewedPaper.setDepth(7)
      
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

  createUI() {
    this.destroyUI()
    
    const uiY = 20
    const barWidth = 200
    const barHeight = 20
    
    this.titleText = this.add.text(20, uiY, 'Detective Biscuit', {
      fontSize: '20px',
      color: '#353535',
      fontStyle: 'bold',
      fontFamily: 'serif'
    }).setScrollFactor(0)

    this.levelText = this.add.text(20, uiY + 35, '', {
      fontSize: '18px',
      color: '#353535',
      fontFamily: 'serif'
    }).setScrollFactor(0)

    this.add.text(20, uiY + 70, 'Health:', {
      fontSize: '16px',
      color: '#353535',
      fontFamily: 'serif'
    }).setScrollFactor(0)

    this.healthBar = this.add.graphics().setScrollFactor(0)
    this.healthText = this.add.text(20 + barWidth + 10, uiY + 68, '', {
      fontSize: '14px',
      color: '#353535',
      fontFamily: 'serif'
    }).setScrollFactor(0)

    this.add.text(20, uiY + 105, 'Mana:', {
      fontSize: '16px',
      color: '#353535',
      fontFamily: 'serif'
    }).setScrollFactor(0)

    this.manaBar = this.add.graphics().setScrollFactor(0)
    this.manaText = this.add.text(20 + barWidth + 10, uiY + 103, '', {
      fontSize: '14px',
      color: '#353535',
      fontFamily: 'serif'
    }).setScrollFactor(0)

    this.expText = this.add.text(20, uiY + 140, '', {
      fontSize: '16px',
      color: '#353535',
      fontFamily: 'serif'
    }).setScrollFactor(0)

    this.controlsText = this.add.text(20, 0, 'WASD: Move | SPACE: Fire | T: Talk | C: Chew TP | P: FPS Game | [ ]: Navigate | ESC: Menu', {
      fontSize: '16px',
      color: '#8B6A4E',
      fontFamily: 'serif'
    }).setScrollFactor(0)
    
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
    return x >= 1 && x <= this.worldWidth - 2 && y >= 1 && y <= this.worldHeight - 2
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
        "Woof! I'm Detective Biscuit and I'm ready for adventure! Let's explore this mysterious world together!"
      )
    }, 1000)
  }

  triggerLevelUpSpeech() {
    const info = this.playerStats.getLastLevelUpInfo()
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

  triggerMovementSpeech() {
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

  triggerRandomSpeech() {
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

  handleResize() {
    this.setupCamera()
    this.calculateWorldSize()
    
    if (this.biscuit) {
      this.biscuit.setPosition(
        this.gridX * this.tileSize + this.tileSize / 2,
        this.gridY * this.tileSize + this.tileSize / 2
      )
    }
    
    this.createGridWorld()
    this.updateDimOverlay()
    this.createUI()
    this.speechBox.resize()
  }
}