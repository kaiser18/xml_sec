export class UpdateProduct {
    public id: number;
    public name: string;
    public quantity: number;
    public pricePerItem: number;

    constructor(id: number, name: string, quantity: number, price: number) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.pricePerItem = price;
    }
}