import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { DatabaseService, ProductCreationResponse } from 'src/app/shared/database.service';
import { Product } from 'src/app/shared/interfaces/product';

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
  @Output() hasChanges: EventEmitter<boolean> = new EventEmitter();
  isShoppingList: boolean = false;
  categories!: Category[];
  notifier$ = new Subject()
  searchResults?: Product[];
  addProductsForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    category_id: new FormControl(null, Validators.required),
    count: new FormControl(1, Validators.required)
  });

  productSearchGrp: FormGroup = new FormGroup({
    productSearch: new FormControl('')
  })

  constructor(private dbService: DatabaseService, private productService:ProductService) { }

  ngOnInit(): void {
    if(window.location.href.includes('shoppinglist')) this.isShoppingList = true;

    this.productSearchGrp.valueChanges.pipe(
      takeUntil(this.notifier$),
      distinctUntilChanged(),
      debounceTime(700),
      filter(r => r?.productSearch?.length >= 2),
      switchMap(searchTerm => {
        return this.dbService.searchProduct(searchTerm.productSearch)
      })
      ).subscribe(e => {
        console.log(e)
        if(e.length) return this.searchResults = e;
        this.searchResults = undefined;
      })

    this.dbService.getAllCategories().pipe(takeUntil(
      this.notifier$
    )).subscribe(res => {
      this.categories = res
    })
  }

  submitForm(): void {
    if(this.addProductsForm.invalid){
      this.addProductsForm.markAllAsTouched();
      return
    }

    this.dbService.addProduct(this.addProductsForm.get('name')?.value, this.addProductsForm.get('category_id')?.value).pipe(
      takeUntil(this.notifier$),
      switchMap((val: ProductCreationResponse) => {
        if(window.location.href.includes('shoppinglist')) {
        return this.dbService.setShoppinglistLevel(val.product.id.toString(), this.addProductsForm.get('count')?.value)

        }
        return this.dbService.setStockLevel(val.product.id.toString(), this.addProductsForm.get('count')?.value)
      })
      ).subscribe(res => {
        console.log(res)
        this.productService.setHasChanges(null);
        this.hasChanges.emit(true);
        this.addProductsForm.reset()
    })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null)
    this.notifier$.complete()
  }

  reset():void {
    this.searchResults = undefined;
  }

  selectItem(event: Event, product: Product) {
    event.preventDefault();
    console.log(product)
    this.addProductsForm.patchValue({
      name: product.name,
      category_id: product.category_id
    })
    this.productSearchGrp.reset();
    this.searchResults = undefined;
  }
}
