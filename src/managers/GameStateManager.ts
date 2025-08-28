import { PlayerStats } from '../systems/PlayerStats'

export class GameStateManager {
  private static instance: GameStateManager
  public playerStats: PlayerStats
  private currentScene: string | null = null

  private constructor() {
    this.playerStats = new PlayerStats()
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager()
    }
    return GameStateManager.instance
  }

  public reset(): void {
    this.playerStats = new PlayerStats()
    this.currentScene = null
  }

  public setCurrentScene(sceneKey: string): void {
    this.currentScene = sceneKey
  }

  public getCurrentScene(): string | null {
    return this.currentScene
  }

  public saveGameState(): object {
    return {
      playerStats: {
        level: this.playerStats.level,
        experience: this.playerStats.experience,
        maxHealth: this.playerStats.maxHealth,
        currentHealth: this.playerStats.currentHealth,
        maxMana: this.playerStats.maxMana,
        currentMana: this.playerStats.currentMana
      },
      currentScene: this.currentScene
    }
  }

  public loadGameState(saveData: any): void {
    if (saveData.playerStats) {
      const stats = saveData.playerStats
      this.playerStats.level = stats.level || 1
      this.playerStats.experience = stats.experience || 0
      this.playerStats.maxHealth = stats.maxHealth || 100
      this.playerStats.currentHealth = stats.currentHealth || 100
      this.playerStats.maxMana = stats.maxMana || 50
      this.playerStats.currentMana = stats.currentMana || 50
    }
    
    if (saveData.currentScene) {
      this.currentScene = saveData.currentScene
    }
  }
}