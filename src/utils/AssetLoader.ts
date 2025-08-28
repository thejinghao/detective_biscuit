import Phaser from 'phaser'
import { ASSET_KEYS } from '../constants/AssetKeys'

export class AssetLoader {
  static preloadAllAssets(scene: Phaser.Scene): void {
    // Biscuit sprites
    scene.load.image(ASSET_KEYS.BISCUIT.WALK1, './src/assets/sprites/biscuit/walk/walk1.png')
    scene.load.image(ASSET_KEYS.BISCUIT.WALK2, './src/assets/sprites/biscuit/walk/walk2.png')
    scene.load.image(ASSET_KEYS.BISCUIT.WALK3, './src/assets/sprites/biscuit/walk/walk3.png')
    scene.load.image(ASSET_KEYS.BISCUIT.WALK4, './src/assets/sprites/biscuit/walk/walk4.png')
    
    scene.load.image(ASSET_KEYS.BISCUIT.CONVO1, './src/assets/sprites/biscuit/convo/convo1.png')
    scene.load.image(ASSET_KEYS.BISCUIT.CONVO2, './src/assets/sprites/biscuit/convo/convo2.png')
    scene.load.image(ASSET_KEYS.BISCUIT.CONVO3, './src/assets/sprites/biscuit/convo/convo3.png')
    scene.load.image(ASSET_KEYS.BISCUIT.CONVO4, './src/assets/sprites/biscuit/convo/convo4.png')
    scene.load.image(ASSET_KEYS.BISCUIT.CONVO5, './src/assets/sprites/biscuit/convo/convo5.png')
    scene.load.image(ASSET_KEYS.BISCUIT.CONVO6, './src/assets/sprites/biscuit/convo/convo6.png')
    
    // UI assets
    scene.load.image(ASSET_KEYS.UI.START, './src/assets/sprites/ui/start.png')
    scene.load.image(ASSET_KEYS.UI.NEXT, './src/assets/sprites/ui/next.png')
    scene.load.image(ASSET_KEYS.UI.DIALOGUE_BOX, './src/assets/sprites/ui/dialoguebox.png')
    scene.load.image(ASSET_KEYS.UI.TOILET_PAPER, './src/assets/sprites/ui/toiletpaper.png')
    scene.load.image(ASSET_KEYS.UI.TOILET_PAPER_CHEWED, './src/assets/sprites/ui/toiletpaper-chewed.png')
    
    // Tiles
    scene.load.image(ASSET_KEYS.TILES.PAWGRASS, './src/assets/sprites/mesh/pawgrass.png')
    scene.load.image(ASSET_KEYS.TILES.GRASS, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMkY3RDMyIi8+CjxwYXRoIGQ9Ik0wIDI0SDE2VjMySDhaIiBmaWxsPSIjMzQ4QjM3Ii8+CjxwYXRoIGQ9Ik0xNiAwSDMyVjhIMTZaIiBmaWxsPSIjMzQ4QjM3Ci8+CjxwYXRoIGQ9Ik0xNiAxNkgzMlYyNEgxNloiIGZpbGw9IiMzNDhCMzciLz4KPC9zdmc+Cg==')
    scene.load.image(ASSET_KEYS.TILES.STONE, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNzk3OTc5Ii8+CjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0iIzk5OTk5OSIvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNCQkJCQkIiLz4KPC9zdmc+Cg==')
    
    // Projectiles
    scene.load.image(ASSET_KEYS.PROJECTILES.OLIVE, './src/assets/sprites/projectile/olive.png')
    scene.load.image(ASSET_KEYS.PROJECTILES.POOP, './src/assets/sprites/projectile/poop.png')
    
    // Backgrounds
    scene.load.image(ASSET_KEYS.BACKGROUNDS.FLOOR, './src/assets/background/floor.png')
    
    // FPS Game assets
    scene.load.image(ASSET_KEYS.FPS.BACKGROUND, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMkEyQTJBIi8+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iNTAiIGZpbGw9IiM2NjY2NjYiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNGRkZGRkYiIGZvbnQtc2l6ZT0iMjQiPkZQUyBBUkVOQTwvdGV4dD4KPC9zdmc+')
    scene.load.image(ASSET_KEYS.FPS.CROSSHAIR, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDRMMTYgMTJNMTYgMjBMMTYgMjhNNCA1TDEyIDUgTTIwIDVMMjggNSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiLz4KPC9zdmc+')
    scene.load.image(ASSET_KEYS.FPS.BULLET, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iNCIgZmlsbD0iI0ZGRkYwMCIvPgo8L3N2Zz4K')
    scene.load.image(ASSET_KEYS.FPS.TARGET, 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNGRjAwMDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEyIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjYiIGZpbGw9IiNGRjAwMDAiLz4KPC9zdmc+')
  }
}