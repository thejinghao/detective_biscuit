export const SCENE_KEYS = {
  BOOT: 'BootScene',
  MAIN_MENU: 'MainMenuScene',
  GAME: 'GameScene',
  SECOND: 'SecondScene',
  FPS: 'FPSScene'
} as const

export type SceneKey = typeof SCENE_KEYS[keyof typeof SCENE_KEYS]