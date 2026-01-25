import type { DieType } from './die-type.ts';

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
