export default class DamageReduction {
  body: number;
  armor: number;
  field: number;
  total: number;

  constructor(
    body: number,
    armor: number,
    field: number,
    total: number
  ) {
    this.body = body;
    this.armor = armor;
    this.field = field;
    this.total = total;
  }
}
