import { Component, OnInit } from '@angular/core';
import { Item } from '../model/item';
import { Order } from '../model/order';
import { ShowProduct } from '../model/show-product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  allProducts: ShowProduct[] = new Array();

  items: Item[] = new Array();

  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.service.getAllProducts().subscribe(
      data => {
        this.allProducts = data;
      }
    );
  }

  addToCart(productId, productQuantity) {
    var item = new Item(productId, productQuantity);

    this.items.push(item);
  }

  order(items) {
    var order = new Order(items);

    this.service.order(order).subscribe(
      res => {
        alert("Order sent.")
      },
      error => {
        alert("Error while sending the order")
      }  
    );
  }
}
