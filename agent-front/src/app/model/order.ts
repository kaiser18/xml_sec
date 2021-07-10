import { Item } from "./item";

export class Order{
    public items: Item[];

    constructor(items: Item[]) {
        this.items = items;
    }
}