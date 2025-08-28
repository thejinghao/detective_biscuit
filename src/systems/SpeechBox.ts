export class SpeechBox {
  private scene: Phaser.Scene
  private container!: Phaser.GameObjects.Container
  private background!: Phaser.GameObjects.Image
  private nameText!: Phaser.GameObjects.Text
  private speechText!: Phaser.GameObjects.Text
  private characterSprite!: Phaser.GameObjects.Image
  private nextSprite!: Phaser.GameObjects.Image
  private isVisible: boolean = false
  private isTyping: boolean = false
  private currentText: string = ''
  private displayedText: string = ''
  private typewriterTimer?: Phaser.Time.TimerEvent
  private currentConvoAsset: number = 1

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createSpeechBox()
  }

  private createSpeechBox() {
    this.updateSpeechBoxSize()
  }

  private updateSpeechBoxSize() {
    if (this.container) {
      this.container.destroy()
    }

    const screenWidth = this.scene.scale.width
    const screenHeight = this.scene.scale.height
    
    // Calculate 4:3 aspect ratio box
    const maxWidth = Math.min(screenWidth - 40, 800)
    const maxHeight = screenHeight * 0.4
    
    let boxWidth = maxWidth
    let boxHeight = (boxWidth * 3) / 4  // 4:3 ratio (width:height)
    
    // If calculated height is too tall, constrain by height instead
    if (boxHeight > maxHeight) {
      boxHeight = maxHeight
      boxWidth = (boxHeight * 4) / 3  // Maintain 4:3 ratio
    }
    
    const boxX = (screenWidth - boxWidth) / 2
    const boxY = screenHeight - boxHeight - 40

    this.container = this.scene.add.container(boxX, boxY)
    this.container.setDepth(1000)
    this.container.setVisible(false)

    this.background = this.scene.add.image(boxWidth / 2, boxHeight / 2, 'ui-dialoguebox')
    this.background.setDisplaySize(boxWidth, boxHeight)
    this.background.setOrigin(0.5, 0.5)

    // Calculate 15% padding
    const paddingX = boxWidth * 0.15
    const paddingY = boxHeight * 0.15
    
    const spriteWidth = 80
    this.characterSprite = this.scene.add.image(boxWidth - spriteWidth - paddingX, paddingY, `biscuit-convo${this.currentConvoAsset}`)
    this.characterSprite.setScale(0.45)
    this.characterSprite.setOrigin(0, 0)

    this.nameText = this.scene.add.text(paddingX, paddingY, '', {
      fontSize: '22px',
      color: '#F24E5C',
      fontStyle: 'bold',
      fontFamily: 'serif'
    })

    this.speechText = this.scene.add.text(paddingX, paddingY + 45, '', {
      fontSize: '22px',
      color: '#353535',
      fontFamily: 'serif',
      wordWrap: { width: boxWidth - spriteWidth - (paddingX * 2) - 20 },
      lineSpacing: 5
    })

    this.nextSprite = this.scene.add.image(boxWidth - paddingX - 30, boxHeight - paddingY - 15, 'ui-next')
      .setOrigin(0.5, 0.5)
      .setScale(0.08)

    this.container.add([this.background, this.characterSprite, this.nameText, this.speechText, this.nextSprite])
  }

  show(speaker: string, message: string, typewriter: boolean = true) {
    if (this.isVisible) {
      this.hide()
    }

    this.currentConvoAsset = (this.currentConvoAsset % 6) + 1
    this.characterSprite.setTexture(`biscuit-convo${this.currentConvoAsset}`)

    this.nameText.setText(speaker)
    this.currentText = message
    this.displayedText = ''
    this.isVisible = true
    this.container.setVisible(true)

    // Show dim overlay
    const gameScene = this.scene as any
    if (gameScene.dimOverlay) {
      gameScene.dimOverlay.setVisible(true)
    }

    if (typewriter) {
      this.startTypewriter()
    } else {
      this.speechText.setText(message)
    }

    // Remove any existing ENTER listeners and add a new one
    this.scene.input.keyboard!.removeAllListeners('keydown-ENTER')
    this.scene.input.keyboard!.on('keydown-ENTER', this.handleEnterKey, this)
  }

  private handleEnterKey = () => {
    if (!this.isVisible) return
    
    if (this.isTyping) {
      this.completeTypewriter()
    } else {
      this.hide()
    }
  }

  resize() {
    if (this.isVisible) {
      const wasVisible = this.isVisible
      const currentSpeaker = this.nameText.text
      const currentMessage = this.currentText
      const wasTyping = this.isTyping
      
      this.hide()
      this.updateSpeechBoxSize()
      
      if (wasVisible) {
        this.show(currentSpeaker, currentMessage, !wasTyping)
      }
    } else {
      this.updateSpeechBoxSize()
    }
  }

  hide() {
    this.isVisible = false
    this.container.setVisible(false)
    this.stopTypewriter()

    // Hide dim overlay
    const gameScene = this.scene as any
    if (gameScene.dimOverlay) {
      gameScene.dimOverlay.setVisible(false)
    }

    // Remove ENTER key listener when hiding
    this.scene.input.keyboard!.off('keydown-ENTER', this.handleEnterKey, this)
  }

  private startTypewriter() {
    this.isTyping = true
    this.displayedText = ''
    this.speechText.setText('')

    this.typewriterTimer = this.scene.time.addEvent({
      delay: 30,
      callback: () => {
        if (this.displayedText.length < this.currentText.length) {
          this.displayedText += this.currentText[this.displayedText.length]
          this.speechText.setText(this.displayedText)
        } else {
          this.isTyping = false
          this.stopTypewriter()
        }
      },
      loop: true
    })
  }

  private completeTypewriter() {
    if (this.typewriterTimer) {
      this.typewriterTimer.destroy()
    }
    this.isTyping = false
    this.displayedText = this.currentText
    this.speechText.setText(this.displayedText)
  }

  private stopTypewriter() {
    if (this.typewriterTimer) {
      this.typewriterTimer.destroy()
      this.typewriterTimer = undefined
    }
  }

  isShowing(): boolean {
    return this.isVisible
  }

  isCurrentlyTyping(): boolean {
    return this.isTyping
  }

  destroy() {
    this.stopTypewriter()
    this.scene.input.keyboard!.off('keydown-ENTER', this.handleEnterKey, this)
    this.container.destroy()
  }
}