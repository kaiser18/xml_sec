export class ShowProduct {
    private id: number;
    private name: string;
    private picture: string;
    private pricePerItem: number;
    private quantity: number;

    constructor(id: number, name: string, picture: string, price: number, quantity: number) {
        this.id = id;
        this.name = name;
        this.picture = picture;
        this.pricePerItem = price;
        this.quantity = quantity;
    }
}