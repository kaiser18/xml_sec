import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  createProductForm: FormGroup;
  name: string;
  quantity: number;
  price: number;

  product: Product;

  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.createProductForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'quantity': new FormControl(0, [Validators.required, Validators.min(0)]),
      'price': new FormControl(0, [Validators.required, Validators.min(0)])
    })
  }

  onSubmit() {
    this.service.createProduct(this.createProduct()).subscribe(
      res => {this.createProductForm.reset();
      alert("succes")
      },
      error => {
        alert("Could not create product.");
      }
    );
  }

  createProduct() : Product {
    this.name = this.createProductForm.value.name;
    this.quantity = this.createProductForm.value.quantity;
    this.price = this.createProductForm.value.price;

    this.product = new Product(this.name, this.quantity, this.price);

    return this.product;
  }

}
