export class Product {
    private name: string;
    private quantity: number;
    private price: number;

    constructor(name: string, quantity: number, price: number) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}