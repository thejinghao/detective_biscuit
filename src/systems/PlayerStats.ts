export class PlayerStats {
  public level: number = 1
  public experience: number = 0
  public maxHealth: number = 100
  public currentHealth: number = 100
  public maxMana: number = 50
  public currentMana: number = 50

  constructor() {}

  getExpToNextLevel(): number {
    return this.level * 100
  }

  addExperience(amount: number): boolean {
    this.experience += amount
    const expNeeded = this.getExpToNextLevel()
    
    if (this.experience >= expNeeded) {
      this.levelUp()
      return true
    }
    return false
  }

  getLastLevelUpInfo(): { level: number, healthIncrease: number, manaIncrease: number } {
    return {
      level: this.level,
      healthIncrease: 20,
      manaIncrease: 10
    }
  }

  levelUp(): void {
    this.experience -= this.getExpToNextLevel()
    this.level++
    
    const healthIncrease = 20
    const manaIncrease = 10
    
    this.maxHealth += healthIncrease
    this.currentHealth = this.maxHealth
    this.maxMana += manaIncrease
    this.currentMana = this.maxMana
  }

  takeDamage(amount: number): void {
    this.currentHealth = Math.max(0, this.currentHealth - amount)
  }

  heal(amount: number): void {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount)
  }

  useMana(amount: number): boolean {
    if (this.currentMana >= amount) {
      this.currentMana -= amount
      return true
    }
    return false
  }

  restoreMana(amount: number): void {
    this.currentMana = Math.min(this.maxMana, this.currentMana + amount)
  }

  getHealthPercentage(): number {
    return this.currentHealth / this.maxHealth
  }

  getManaPercentage(): number {
    return this.currentMana / this.maxMana
  }

  getExpPercentage(): number {
    return this.experience / this.getExpToNextLevel()
  }
}