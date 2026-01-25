export default class Item {
  name: string;
  bulk: number;
  price: number;

  constructor(
    name: string,
    bulk: number = 0,
    price: number = 0
  ) {
    this.name = name;
    this.bulk = bulk;
    this.price = price;
  }
}
