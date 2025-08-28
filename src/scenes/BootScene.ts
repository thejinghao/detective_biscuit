import Phaser from 'phaser'
import { ASSET_KEYS, ANIMATION_KEYS } from '../constants/AssetKeys'
import { GAME_CONFIG } from '../constants/GameConfig'
import { SCENE_KEYS } from '../constants/SceneKeys'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT })
  }

  preload() {
    this.load.image('biscuit-walk1', '/src/assets/sprites/biscuit/walk/walk1.png')
    this.load.image('biscuit-walk2', '/src/assets/sprites/biscuit/walk/walk2.png')
    this.load.image('biscuit-walk3', '/src/assets/sprites/biscuit/walk/walk3.png')
    this.load.image('biscuit-walk4', '/src/assets/sprites/biscuit/walk/walk4.png')
    
    this.load.image('biscuit-convo1', '/src/assets/sprites/biscuit/convo/convo1.png')
    this.load.image('biscuit-convo2', '/src/assets/sprites/biscuit/convo/convo2.png')
    this.load.image('biscuit-convo3', '/src/assets/sprites/biscuit/convo/convo3.png')
    this.load.image('biscuit-convo4', '/src/assets/sprites/biscuit/convo/convo4.png')
    this.load.image('biscuit-convo5', '/src/assets/sprites/biscuit/convo/convo5.png')
    this.load.image('biscuit-convo6', '/src/assets/sprites/biscuit/convo/convo6.png')
    
    this.load.image('ui-start', '/src/assets/sprites/ui/start.png')
    this.load.image('ui-next', '/src/assets/sprites/ui/next.png')
    this.load.image('ui-dialoguebox', '/src/assets/sprites/ui/dialoguebox.png')
    
    this.load.image('pawgrass-tile', '/src/assets/sprites/mesh/pawgrass.png')
    this.load.image('olive-projectile', '/src/assets/sprites/projectile/olive.png')
    this.load.image('poop', '/src/assets/sprites/projectile/poop.png')
    this.load.image('grass-tile', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMkY3RDMyIi8+CjxwYXRoIGQ9Ik0wIDI0SDE2VjMySDhaIiBmaWxsPSIjMzQ4QjM3Ii8+CjxwYXRoIGQ9Ik0xNiAwSDMyVjhIMTZaIiBmaWxsPSIjMzQ4QjM3Ii8+CjxwYXRoIGQ9Ik0xNiAxNkgzMlYyNEgxNloiIGZpbGw9IiMzNDhCMzciLz4KPC9zdmc+Cg==')
    
    this.load.image('stone-tile', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNzk3OTc5Ii8+CjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0iIzk5OTk5OSIvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNCQkJCQkIiLz4KPC9zdmc+Cg==')
    
    this.load.image('floor-bg', '/src/assets/background/floor.png')
    
    this.load.image('toilet-paper', '/src/assets/sprites/ui/toiletpaper.png')
    this.load.image('toilet-paper-chewed', '/src/assets/sprites/ui/toiletpaper-chewed.png')
    
    // FPS Game assets
    this.load.image('fps-bg', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMkEyQTJBIi8+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iNTAiIGZpbGw9IiM2NjY2NjYiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiIGZvbnQtc2l6ZT0iMjQiPkZQUyBBUkVOQTwvdGV4dD4KPC9zdmc+')
    this.load.image('fps-crosshair', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDRMMTYgMTJNMTYgMjBMMTYgMjhNNCA1TDEyIDUgTTIwIDVMMjggNSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiLz4KPC9zdmc+')
    this.load.image('fps-bullet', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iNCIgZmlsbD0iI0ZGRkYwMCIvPgo8L3N2Zz4K')
    this.load.image('fps-target', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNGRjAwMDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEyIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjYiIGZpbGw9IiNGRjAwMDAiLz4KPC9zdmc+')
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