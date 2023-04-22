import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { CategoryService } from 'src/app/shared/category.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { Category } from 'src/app/shared/interfaces/category';
import { Product } from 'src/app/shared/interfaces/product';
import { Alert } from '../info-box/info-box.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  notifier$ = new Subject();
  products?: Product[];
  categories?: Category[];
  displayList?: Product[];
  asc: boolean = true;

  showInfoBox: boolean = false;
  infoText?: string;
  alertType?: Alert;

  activeFilter: string = 'all';

  changeProductCategoryGrp: FormGroup = new FormGroup({
    changeProductCategory: new FormControl(this.activeFilter)
  })

  changemode: boolean = false;

  constructor(private productService: ProductService, private db: DatabaseService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.productService.getProducts$().pipe(takeUntil(this.notifier$)).subscribe(products => {
      this.products = this.asc ? products.sort() : products.reverse();
    });

    this.categoryService.getCategories$().pipe(takeUntil(this.notifier$)).subscribe(categories => {
      this.categories = categories;
    })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  deleteProduct(product_id: number) {
    this.productService.deleteProduct(product_id).pipe(takeUntil(this.notifier$)).subscribe(e => {
      if (e)
        this.productService.setHasChanges(null);
    })
  }

  sort() {
    this.asc = !this.asc;
    this.products?.reverse()
  }

  filter(activeFilter: string) {
    this.activeFilter = activeFilter;
    if (activeFilter === 'all') {
      this.displayList = undefined;
      return;
    }
    if (activeFilter === 'fallback') {
      this.displayList = this.products?.filter(product => product.category_id === null)
      return;
    }
    this.displayList = this.products?.filter(product => product.category_id === parseInt(activeFilter))
  }

  search(searchTerm: string): void {
    console.log(searchTerm)
    if (searchTerm.length < 2) {
      this.displayList = undefined;
      return
    }
    this.displayList = this.products?.filter(product => product.name.toLowerCase().includes(searchTerm))
  }

  changeFilter() {
    this.changemode = !this.changemode;
    console.log(this.changemode)
  }

  changePoductCategory(product: Product) {
    const newCategory = this.changeProductCategoryGrp.get('changeProductCategory')?.value;
    if (newCategory == product.category_id) {
      this.alertType = 'warning';
      this.infoText = 'Product ist bereits in ' + product.category_name;
      this.showInfoBox = true;
      this.displayInfoBox();
      return
    };
    this.db.changeProductCategory(product, newCategory).pipe(takeUntil(this.notifier$)).subscribe(e => {
      console.log(e)
      this.alertType = 'success';
      this.infoText = "Produkt wurde erfolgreich verschoben"
      this.displayInfoBox();

      // close bootstrap modal
      console.log(document.querySelector<HTMLElement>('.btn-close'))
      setTimeout(() => {
        document.querySelector<HTMLElement>('#close')!.click();
        this.productService.setHasChanges(true);
      }, 1000);

    }, error => {
      this.alertType = 'danger';
      this.infoText = 'Da ist etwas schief gelaufen';
      this.displayInfoBox();
    });
  }

  displayInfoBox() {
    this.showInfoBox = true;
    setTimeout(() => {
      this.showInfoBox = false;
    }, 2000)
  }
}
