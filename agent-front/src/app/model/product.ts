export class Product {
    public name: string;
    public quantity: number;
    public pricePerItem: number;

    constructor(name: string, quantity: number, price: number) {
        this.name = name;
        this.quantity = quantity;
        this.pricePerItem = price;
    }
}