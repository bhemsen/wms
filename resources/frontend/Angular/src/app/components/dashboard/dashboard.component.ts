import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  notifier$ = new Subject();
  products?: Product[];
  displayList?: Product[];
  asc:boolean = true;

  searchForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required)
  })

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts$().pipe(takeUntil(this.notifier$)).subscribe(products => {
      this.products = this.asc? products.sort() : products.reverse();
    })

    this.searchForm.valueChanges
    .pipe(
      takeUntil(this.notifier$),
      debounceTime(500), 
      filter(e => {
        if(e?.search?.length >= 2) {
          return e
        }
        this.displayList = undefined;
      })
      )
      .subscribe(val => {
        console.log(val, val.search)
        this.displayList = this.products?.filter(product => product.name.toLowerCase().includes(val.search.toLowerCase()))
    })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  deleteProduct(product_id: number) {
    this.productService.deleteProduct(product_id).pipe(takeUntil(this.notifier$)).subscribe(e=> {
      console.log(e)
      if(e)
        this.productService.setHasChanges(null);
    })
  }

  sort() {
    this.asc = !this.asc;
    this.products?.reverse()
  }
}
