import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { DatabaseService, ProductCreationResponse } from 'src/app/shared/database.service';

export interface Category {
  id: number,
  name:string,
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  categories!: Category[];
  notifier$ = new Subject()
  addProductsForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    category_id: new FormControl(''),
    count: new FormControl(1, Validators.required)
  });

  constructor(private dbService: DatabaseService, private productService:ProductService) { }

  ngOnInit(): void {
    this.dbService.getAllCategories().pipe(takeUntil(
      this.notifier$
    )).subscribe(res => {
      this.categories = res
      console.log(res)
    })
  }

  submitForm(): void {
    if(this.addProductsForm.invalid){
      console.log('invalid')
      this.addProductsForm.markAllAsTouched();
      return
    }
    // with category
    // this.dbService.addProduct(this.addProductsForm.get('name')?.value, this.addProductsForm.get('category_id')?.value).pipe(
    // without category
    this.dbService.addProduct(this.addProductsForm.get('name')?.value).pipe(

      takeUntil(this.notifier$),
      switchMap((val: ProductCreationResponse) => {
        console.log(val, this.addProductsForm.get('count')?.value)
        return this.dbService.setStockLevel(val.product.id.toString(), this.addProductsForm.get('count')?.value)
      })
      ).subscribe(res => {
        this.productService.setHasChanges(null);
        this.addProductsForm.reset()
    })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null)
    this.notifier$.complete()
  }

}
