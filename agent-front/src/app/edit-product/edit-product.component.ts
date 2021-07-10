import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
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

  constructor(private service: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(parameterMap => {
      const id = +parameterMap.get('product.id');
      this.getProduct(id);
    })

    this.id = this.product.id;
    this.name = this.product.name;
    this.quantity = this.product.quantity;
    this.price = this.product.pricePerItem;
    
    this.editProductForm = new FormGroup({
      'id': new FormControl({value: this.id, disabled: true}),
      'name': new FormControl({value: this.name}, [Validators.required]),
      'quantity': new FormControl({value: this.quantity}, [Validators.required, Validators.min(0)]),
      'price': new FormControl({value: this.price}, [Validators.required, Validators.min(0)])
    })
  }

  getProduct(id: number) {
    this.service.getProductById(id).subscribe(
      res => {
        this.product = res;
      }
    );
  }

  onSubmit() {
    this.service.editProduct(this.createProduct()).subscribe(
      res => {this.editProductForm.reset();
      alert("success")
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
