import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';
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

  constructor(public fb: FormBuilder, private service: ProductService) {}

  ngOnInit(): void {
    this.createProductForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'quantity': new FormControl(0, [Validators.required, Validators.min(0)]),
      'price': new FormControl(0, [Validators.required, Validators.min(0)]),
      'img': new FormControl('')
    })
  }

  onSubmit() {
    var formData: any = new FormData();
    console.log(JSON.stringify(this.createProduct()));
    formData.append("data", JSON.stringify(this.createProduct()));
    formData.append("file", this.createProductForm.get('img').value)

    this.service.createProduct(formData).subscribe(
      res => {this.createProductForm.reset();
      alert("success")
      },
      error => {
        alert("Could not create product.");
      }
    );
  }

  upload(event) {
    console.log("ulaz")
    if (event.target.files.length > 0) {
      console.log("puc puc")
      const file = event.target.files[0];
      console.log('file', file)
      this.createProductForm.controls['img'].setValue(file);
    }
  }

  createProduct() : Product {
    this.name = this.createProductForm.value.name;
    this.quantity = this.createProductForm.value.quantity;
    this.price = this.createProductForm.value.price;

    this.product = new Product(this.name, this.quantity, this.price);

    return this.product;
  }

}
