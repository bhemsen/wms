import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, fromEvent, of, Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { DatabaseService, ProductCreationResponse } from 'src/app/shared/database.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, AfterViewInit, OnDestroy {
  notifier$ = new Subject()
  clear$ = new Subject()
  shoppingList?: Product[];
  displayList?: Product[];

  shoppingList$: Subject<Product[]> = new Subject();
  hasChanges$: Subject<any> = new Subject();

  private mouseDown$ = fromEvent(document, 'mousedown');
  private mouseUp$ = fromEvent(document, 'mouseup');

  constructor(private dbService: DatabaseService, private productService: ProductService) {
  }

  @ViewChildren('listItem') listItems?: QueryList<ElementRef>;

  @HostListener('mousedown', ['$event'])
  startTimer(event: MouseEvent) {
    const item = (event.target as HTMLElement);
    const product = this.shoppingList!.filter(product => product.name == item.innerText)[0];

    console.log((event.target as HTMLElement));
    this.mouseDown$.pipe(
      switchMap(() => timer(700)),
      takeUntil(this.clear$),
      switchMap(() => {
        console.log('.7s seconds have passed!');
        item.classList.add('bought')
        console.log(product);
        return this.dbService.addProduct(product.name, product.category_id?.toString())
      }),
      switchMap((val: ProductCreationResponse) => {
        this.dbService.deleteProdutShoppinglist(product, product.count).subscribe();
        return this.dbService.setStockLevel(val.product.id.toString(), product.count);

      })
    ).subscribe((res) => {
      console.log(res);
      setTimeout(() => {
        this.hasChanges$.next(true);
        this.productService.setHasChanges(true)
      }, 300)
    });
  }

  @HostListener('mouseup', ['$event'])
  clearTimer() {
    this.clear$.next(null)
  }



  ngOnInit(): void {
    this.dbService.getShoppingList().pipe(takeUntil(this.notifier$)).subscribe(e => {
      this.shoppingList$.next(e)
    })

    this.hasChanges$.pipe(
      takeUntil(this.notifier$),
      switchMap(() => {
        return this.dbService.getShoppingList()
      })
    ).subscribe((products) => {
      this.shoppingList$.next(products);
    })

    this.shoppingList$.pipe(takeUntil(this.notifier$)).subscribe(e => {
      this.shoppingList = e;
    })
  }

  ngAfterViewInit(): void {
    this.listItems?.changes.pipe(takeUntil(this.notifier$)).subscribe(e => {
      e.forEach((element: any) => {
        console.log(element)
      });
    })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.clear$.next(null)
    this.notifier$.complete();
    this.clear$.complete();
  }

  search(searchTerm: string): void {
    console.log(searchTerm)
    if (searchTerm.length < 2) {
      this.displayList = undefined;
      return
    }
    this.displayList = this.shoppingList?.filter(product => product.name.toLowerCase().includes(searchTerm))
  }
}
