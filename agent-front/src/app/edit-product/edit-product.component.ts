import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../model/product';
import { UpdateProduct } from '../model/update-product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  editProductForm: FormGroup;
  id: number;
  name: string;
  quantity: number;
  price: number;

  product: UpdateProduct;

  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.editProductForm = new FormGroup({
      'id': new FormControl({value: this.id, disabled: true}),
      'name': new FormControl('', [Validators.required]),
      'quantity': new FormControl(0, [Validators.required, Validators.min(0)]),
      'price': new FormControl(0, [Validators.required, Validators.min(0)])
    })
  }

  onSubmit() {
    this.service.editProduct(this.createProduct()).subscribe(
      res => {this.editProductForm.reset();
      alert("succes")
      },
      error => {
        alert("Could not edit product.");
      }
    );
  }

  createProduct() : UpdateProduct {
    this.name = this.editProductForm.value.name;
    this.quantity = this.editProductForm.value.quantity;
    this.price = this.editProductForm.value.price;

    this.product = new UpdateProduct(this.id, this.name, this.quantity, this.price);

    return this.product;
  }
}
