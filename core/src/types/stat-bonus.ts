import type { Stat } from './stat.ts';

export default class StatBonus {
  stat: Stat;
  bonus: number;

  constructor(stat: Stat, bonus: number) {
    this.stat = stat;
    this.bonus = bonus;
  }
}
