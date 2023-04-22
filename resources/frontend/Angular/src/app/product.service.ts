import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DatabaseService } from './shared/database.service';
import { Product } from './shared/interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnDestroy {
  notifier$ = new Subject();
  products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  hasChanges$: Subject<any> = new Subject();

  constructor(private dbService: DatabaseService) {
    this.dbService.getAllProducts().pipe(takeUntil(this.notifier$)).subscribe(e => {
      this.products$.next(e);
    });

    this.hasChanges$.pipe(
      takeUntil(this.notifier$),
      switchMap(()=> {
        return this.dbService.getAllProducts()
      })
    ).subscribe((products)=> {
      this.products$.next(products);
    })

   }


  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  updateProductCount(product:Product, newCount: number) {
    if(newCount > product.count) {
      return this.dbService.setStockLevel(product.id.toString(), newCount - product.count)
    }
    return this.dbService.deleteProdut(product, product.count - newCount)
  }

  updateProductCountShoppingList(product:Product, newCount: number) {
    if(newCount > product.count) {
      return this.dbService.setShoppinglistLevel(product.id.toString(), newCount - product.count)
    }
    return this.dbService.deleteProdutShoppinglist(product, product.count - newCount)
  }

  deleteProduct(product_id:number): Observable<any> {
    return this.dbService.deleteProduct(product_id.toString());
  }

  setHasChanges(val:any): void {
    this.hasChanges$.next(val);
  }

  getHasChanges(): Subject<any> {
    return this.hasChanges$;
  }

  getProducts$():Subject<Product[]> {
    return this.products$
  }
}
