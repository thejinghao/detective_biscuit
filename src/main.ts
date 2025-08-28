import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MainMenuScene } from './scenes/MainMenuScene'
import { GameSceneRefactored as GameScene } from './scenes/GameSceneRefactored'
import { SecondScene } from './scenes/SecondScene'
import { FPSScene } from './scenes/FPSScene'
import { GAME_CONFIG } from './constants/GameConfig'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%'
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, MainMenuScene, GameScene, SecondScene, FPSScene]
}

window.addEventListener('resize', () => {
  if (game && game.scene.isActive('GameScene')) {
    const gameScene = game.scene.getScene('GameScene') as any
    if (gameScene && gameScene.handleResize) {
      gameScene.handleResize()
    }
  }
  if (game && game.scene.isActive('SecondScene')) {
    const secondScene = game.scene.getScene('SecondScene') as any
    if (secondScene && secondScene.handleResize) {
      secondScene.handleResize()
    }
  }
})

const game = new Phaser.Game(config)