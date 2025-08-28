import Phaser from 'phaser'
import { ASSET_KEYS, ANIMATION_KEYS } from '../constants/AssetKeys'
import { GAME_CONFIG } from '../constants/GameConfig'
import { SCENE_KEYS } from '../constants/SceneKeys'
import { AssetLoader } from '../utils/AssetLoader'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT })
  }

  preload() {
    AssetLoader.preloadAllAssets(this)
  }

  create() {
    this.anims.create({
      key: ANIMATION_KEYS.BISCUIT_WALK,
      frames: [
        { key: ASSET_KEYS.BISCUIT.WALK1 },
        { key: ASSET_KEYS.BISCUIT.WALK2 },
        { key: ASSET_KEYS.BISCUIT.WALK3 },
        { key: ASSET_KEYS.BISCUIT.WALK4 }
      ],
      frameRate: GAME_CONFIG.ANIMATION.WALK_FRAME_RATE,
      repeat: -1
    })

    this.anims.create({
      key: ANIMATION_KEYS.BISCUIT_IDLE,
      frames: [{ key: ASSET_KEYS.BISCUIT.WALK1 }],
      frameRate: 1
    })

    this.scene.start(SCENE_KEYS.MAIN_MENU)
  }
}