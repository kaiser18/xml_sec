import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../model/order';
import { ShowProduct } from '../model/show-product';
import { UpdateProduct } from '../model/update-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  createProduct(data: any) {
    return this.http.post(`${environment.baseUrl}/${environment.product}`, data,
      {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Authorization', "Bearer " + localStorage.getItem('token'))
      }
    )
  }

  editProduct(product: UpdateProduct) {
    return this.http.put(`${environment.baseUrl}/${environment.product}`, product,
      {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Authorization', "Bearer " + localStorage.getItem('token'))
      }
    )
  }

  getProductById(id: number) : Observable<UpdateProduct> {
    return this.http.get<UpdateProduct>(`${environment.baseUrl}/${environment.product}/${id}`)
  }

  getAllProducts(): Observable<ShowProduct[]> {
    return this.http.get<ShowProduct[]>(`${environment.baseUrl}/${environment.product}`)
  }

  delete(id: number) {
    return this.http.delete(`${environment.baseUrl}/${environment.product}/${id}`, 
    {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + localStorage.getItem('token'))
    })
  }

  order(order: Order) {
    return this.http.post(`${environment.baseUrl}/${environment.order}`, order, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + localStorage.getItem('token'))
    })
  }
}
