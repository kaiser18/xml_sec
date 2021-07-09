import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';
import { UpdateProduct } from '../model/update-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  createProduct(product: Product) {
    return this.http.post(`${environment.baseUrl}/${environment.createProduct}`, product, {responseType : 'text'})
  }

  editProduct(product: UpdateProduct) {
    return this.http.post(`${environment.baseUrl}/${environment.editProduct}`, product, {responseType : 'text'})
  }
}
