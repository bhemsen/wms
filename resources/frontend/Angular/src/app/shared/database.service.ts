import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from './interfaces/category';
import { Product } from './interfaces/product';
import { CookieService } from './cookie.service';
import { catchError } from 'rxjs/operators';

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
  userId: string | undefined;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.userId = this.cookieService.getCookie('user_id');
    this.headers = new HttpHeaders({
      Accept: 'application/json'
    })
  }

  addCategory(category: string): Observable<any> {
    return this.http.post(`${this.baseApi}categories`, { name: category });
  }

  updateCategoryName(category_id: number, name: string) {
    return this.http.patch(`${this.baseApi}user/categories/${category_id}`, { name: name })
  }

  deleteCategory(category_id: string): Observable<any> {
    return this.http.delete(`${this.baseApi}user/categories/${category_id}`)
  }

  addProduct(name: string, category_id: string): Observable<ProductCreationResponse> {
    return this.http.post<ProductCreationResponse>(`${this.baseApi}products`, { name: name, category_id: category_id });
  }

  changeProductCategory(product: Product, category_id: string) {
    return this.http.patch(`${this.baseApi}products/${category_id}`, { product: product }).pipe(catchError(e => e))
  }

  deleteProduct(product_id: string): Observable<any> {
    return this.http.delete(`${this.baseApi}products/${product_id}`)
  }

  searchProduct(productName: string): Observable<any> {
    return this.http.get(`${this.baseApi}products/search/${productName}`)

  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseApi}categories`)
  }

  getUserCategories() {
    return this.http.get<Category[]>(`${this.baseApi}user/categories`)
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseApi}user/products/${this.userId}`)
  }

  getStockLevel(product_id: string): Observable<any> {
    return this.http.get(`${this.baseApi}stock/${product_id}`);
  }

  setStockLevel(product_id: string, count: number): Observable<any> {
    return this.http.post(`${this.baseApi}stock`, { product_id: product_id, count: count, user_id: this.userId })
  }

  deleteProdut(product: Product, amount: number): Observable<any> {
    return this.http.delete(`${this.baseApi}stock/${product.id}/${amount}/${this.userId}`)
  }

  getShoppingList(): Observable<Product[]> {
    console.log(this.userId)
    return this.http.get<Product[]>(`${this.baseApi}user/shoppinglist/products/${this.userId}`)
  }

  setShoppinglistLevel(product_id: string, count: number): Observable<any> {
    return this.http.post(`${this.baseApi}shoppinglist`, { product_id: product_id, count: count, user_id: this.userId })
  }

  deleteProdutShoppinglist(product: Product, amount: number): Observable<any> {
    return this.http.delete(`${this.baseApi}shoppinglist/${product.id}/${amount}/${this.userId}`)
  }

  test() {
    return this.http.get(`${this.baseApi}products`)
  }
}
