import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { DatabaseService } from 'src/app/shared/database.service';
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

  constructor(private productService: ProductService, private db: DatabaseService) { }

  ngOnInit(): void {
    console.log('init')

    this.db.test().subscribe(e => {
      console.log(e)
    })

    this.productService.getProducts$().pipe(takeUntil(this.notifier$)).subscribe(products => {
      this.products = this.asc? products.sort() : products.reverse();
    })


  }

  ngOnDestroy(): void {
      console.log('destroy')

    this.notifier$.next(null);
    this.notifier$.complete();
  }

  deleteProduct(product_id: number) {
    this.productService.deleteProduct(product_id).pipe(takeUntil(this.notifier$)).subscribe(e=> {
      if(e)
        this.productService.setHasChanges(null);
    })
  }

  sort() {
    this.asc = !this.asc;
    this.products?.reverse()
  }

  filter(activeFilter: string) {
    if(activeFilter === 'all') {
      this.displayList = undefined;
      return
    }
    this.displayList = this.products?.filter(product => product.category_name === activeFilter)
  }

  search(searchTerm: string): void {
    console.log(searchTerm)
    if(searchTerm.length < 2) {
      this.displayList = undefined;
      return
    }
    this.displayList = this.products?.filter(product => product.name.toLowerCase().includes(searchTerm))
  }
}
