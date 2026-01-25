import type { DieType } from './die-type.js';

export default class DiceFormula {
  dieType: DieType;
  diceNumber: number;
  bonus: number;

  constructor(
    dieType: DieType,
    diceNumber: number,
    bonus: number
  ) {
    this.dieType = dieType;
    this.diceNumber = diceNumber;
    this.bonus = bonus;
  }
}
