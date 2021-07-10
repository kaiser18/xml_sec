import { Component, OnInit } from '@angular/core';
import { ShowProduct } from '../model/show-product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  allProducts: ShowProduct[] = new Array();

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

  delete(productId) {
    this.service.delete(productId).subscribe(
      data => {
        this.loadAllProducts();
      }
    )
  }

}
