import Phaser from 'phaser'

export class FPSScene extends Phaser.Scene {
  private crosshair!: Phaser.GameObjects.Image
  private targets!: Phaser.GameObjects.Group
  private bullets!: Phaser.GameObjects.Group
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private background!: Phaser.GameObjects.Image
  // private returnText!: Phaser.GameObjects.Text
  private previousScene: string = 'GameScene'

  constructor() {
    super({ key: 'FPSScene' })
  }

  init(data: { fromScene?: string }) {
    this.previousScene = data.fromScene || 'GameScene'
  }

  create() {
    this.score = 0
    
    this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'fps-bg')
    this.background.setDisplaySize(this.scale.width, this.scale.height)

    this.targets = this.add.group()
    this.bullets = this.add.group()

    this.crosshair = this.add.image(this.scale.width / 2, this.scale.height / 2, 'fps-crosshair')
    this.crosshair.setDepth(100)
    this.crosshair.setScale(1.5)

    this.scoreText = this.add.text(20, 20, 'SCORE: 0', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setDepth(99)

    this.add.text(20, 60, 'Press ESC to return', {
      fontSize: '18px',
      color: '#CCCCCC'
    }).setDepth(99)

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.crosshair.setPosition(pointer.x, pointer.y)
    })

    this.input.on('pointerdown', () => {
      this.shoot()
    })

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start(this.previousScene)
    })

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.shoot()
    })

    this.spawnTarget()
    
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnTarget,
      callbackScope: this,
      loop: true
    })

    this.physics.world.on('worldbounds', (_event: any, body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject && (body.gameObject as any).texture && (body.gameObject as any).texture.key === 'fps-bullet') {
        body.gameObject.destroy()
      }
    })
  }

  shoot() {
    const bullet = this.physics.add.sprite(this.crosshair.x, this.crosshair.y, 'fps-bullet')
    bullet.setScale(2)
    bullet.setDepth(50)
    bullet.body!.setCollideWorldBounds(true)
    bullet.body!.onWorldBounds = true
    
    const angle = Phaser.Math.Angle.Between(
      this.crosshair.x, this.crosshair.y,
      this.crosshair.x, this.crosshair.y - 100
    )
    
    this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle) - 90, 600, bullet.body!.velocity)
    
    this.bullets.add(bullet)

    this.physics.add.overlap(bullet, this.targets, (bullet: any, target: any) => {
      bullet.destroy()
      target.destroy()
      this.score += 10
      this.scoreText.setText(`SCORE: ${this.score}`)
      
      this.tweens.add({
        targets: this.scoreText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true
      })
    })

    setTimeout(() => {
      if (bullet && bullet.active) {
        bullet.destroy()
      }
    }, 3000)
  }

  spawnTarget() {
    const x = Phaser.Math.Between(50, this.scale.width - 50)
    const y = Phaser.Math.Between(100, this.scale.height - 100)
    
    const target = this.physics.add.sprite(x, y, 'fps-target')
    target.setScale(0.8)
    target.setDepth(10)
    target.body!.setCollideWorldBounds(true)
    target.body!.setBounce(1, 1)
    target.body!.setVelocity(
      Phaser.Math.Between(-200, 200),
      Phaser.Math.Between(-200, 200)
    )
    
    this.targets.add(target)

    this.tweens.add({
      targets: target,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })

    setTimeout(() => {
      if (target && target.active) {
        target.destroy()
      }
    }, 8000)
  }

  update() {
    // Clean up destroyed bullets and targets
    this.bullets.children.entries.forEach((bullet: any) => {
      if (!bullet.active) {
        this.bullets.remove(bullet)
      }
    })
    
    this.targets.children.entries.forEach((target: any) => {
      if (!target.active) {
        this.targets.remove(target)
      }
    })
  }
}