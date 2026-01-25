import type { Stat } from './stat.js';

export default class StatBonus {
  stat: Stat;
  bonus: number;

  constructor(stat: Stat, bonus: number) {
    this.stat = stat;
    this.bonus = bonus;
  }
}
