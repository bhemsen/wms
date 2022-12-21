import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from './interfaces/category';
import { Product } from './interfaces/product';

export interface ProductCreationResponse {
  message: string,
  product: {
    category_id: string,
    created_at: string,
    id: number,
    name: string,
    updated_at: string
  }
}

@Injectable({
  providedIn: 'root'
})


export class DatabaseService {
  baseApi: string = environment.baseApi
  headers: HttpHeaders;

  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders({
      Accept: 'application/json'
    })
  }

  addCategory(category: string): Observable<any> {
    return this.http.post(`${this.baseApi}categories`, {name : category});
  }
  
  addProduct(name: string, category_id: string = '3'): Observable<ProductCreationResponse> {
    return this.http.post<ProductCreationResponse>(`${this.baseApi}products`, {name : name, category_id: category_id});
  }

  deleteProduct(product_id: string): Observable<any> {
    return this.http.delete(`${this.baseApi}products/${product_id}`)
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseApi}categories`)
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<Category[]>(`${this.baseApi}products`)
  }

  getStockLevel(product_id: string): Observable<any> {
    return this.http.get(`${this.baseApi}stock/${product_id}`);
  }

  setStockLevel(product_id: string, count:number): Observable<any> {
    return this.http.post(`${this.baseApi}stock`, {product_id : product_id, count: count})
  }

  deleteProdut(product: Product, amount:number): Observable<any> {
    return this.http.delete(`${this.baseApi}stock/${product.id}/${amount}`)
  }

}
