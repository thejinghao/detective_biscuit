export const ASSET_KEYS = {
  BISCUIT: {
    WALK1: 'biscuit-walk1',
    WALK2: 'biscuit-walk2',
    WALK3: 'biscuit-walk3',
    WALK4: 'biscuit-walk4',
    CONVO1: 'biscuit-convo1',
    CONVO2: 'biscuit-convo2',
    CONVO3: 'biscuit-convo3',
    CONVO4: 'biscuit-convo4',
    CONVO5: 'biscuit-convo5',
    CONVO6: 'biscuit-convo6'
  },
  UI: {
    START: 'ui-start',
    NEXT: 'ui-next',
    DIALOGUE_BOX: 'ui-dialoguebox',
    TOILET_PAPER: 'toilet-paper',
    TOILET_PAPER_CHEWED: 'toilet-paper-chewed'
  },
  TILES: {
    PAWGRASS: 'pawgrass-tile',
    GRASS: 'grass-tile',
    STONE: 'stone-tile'
  },
  PROJECTILES: {
    OLIVE: 'olive-projectile',
    POOP: 'poop'
  },
  BACKGROUNDS: {
    FLOOR: 'floor-bg'
  },
  FPS: {
    BACKGROUND: 'fps-bg',
    CROSSHAIR: 'fps-crosshair',
    BULLET: 'fps-bullet',
    TARGET: 'fps-target'
  }
} as const

export const ANIMATION_KEYS = {
  BISCUIT_WALK: 'biscuit-walk',
  BISCUIT_IDLE: 'biscuit-idle'
} as const