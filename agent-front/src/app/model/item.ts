export class Item {
    public productId: number;
    public quantity: number;

    constructor(id: number, quantity: number) {
        this.productId = id;
        this.quantity = quantity;
    }
}