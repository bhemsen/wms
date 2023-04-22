import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { CategoryService } from 'src/app/shared/category.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { Category } from '../product/product.component';

export interface Filter {
  name: string
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnChanges, OnInit, OnDestroy {
  @Input() changemode: boolean = false;

  @Output() activeFilter: EventEmitter<string> = new EventEmitter();
  @Output() nameChanged: EventEmitter<boolean> = new EventEmitter();

  filterForm: FormGroup = new FormGroup({
    filter: new FormControl('all')
  });

  addCategory: FormControl = new FormControl('', Validators.required)

  hasChanges$ = new Subject();

  notifier$ = new Subject();
  filters: Category[] = [];
  filters$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);

  changingFilterId?: number;

  constructor(private dbService: DatabaseService, private categoryService: CategoryService, private productService: ProductService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.changemode) this.resetUpdateIputs();
  }

  ngOnInit(): void {
    this.categoryService.getCategories$().pipe(takeUntil(this.notifier$)).subscribe(categories => {
      this.filters$.next(categories);
    });

    this.filterForm.valueChanges.pipe(takeUntil(this.notifier$)).subscribe(e => {
      console.log(e.filter)
      this.activeFilter.emit(e.filter)
    })

    this.hasChanges$.pipe(
      takeUntil(this.notifier$),
      switchMap(() => {
        return this.categoryService.getCategories$()
      })
    ).subscribe((filters) => {
      this.filters$.next(filters);
    })

    this.filters$.pipe(takeUntil(this.notifier$)).subscribe(e => {
      this.filters = e;
      this.filterForm.patchValue({ filter: 'all' });
    })
  }

  addNewCategory() {
    const cat = this.addCategory.value
    if (cat.length > 0) {
      this.dbService.addCategory(cat).pipe(takeUntil(this.notifier$)).subscribe(e => {
        this.addCategory.reset();
        this.categoryService.setHasChanges(true)
      })
    }
  }
  changeInput(elemId: string, filterId: number) {
    this.changingFilterId = filterId;
    const elem = document.getElementById(elemId);
    if (elem?.classList.contains('d-none')) {
      elem?.classList.remove('d-none');
      elem.querySelector('input')?.focus()
      return;
    }
    elem?.classList.add('d-none');
    this.changingFilterId = undefined;
  }

  changeCategoryName(inputId: number, cat: Category) {
    const inuptElem: HTMLInputElement = document.getElementById('input__' + inputId) as HTMLInputElement
    this.filters.forEach(elem => {
      if (elem.id === cat.id) {
        elem.name = inuptElem.value;
        this.dbService.updateCategoryName(cat.id, inuptElem.value).subscribe(e => {
          console.log(e);
          this.categoryService.setHasChanges(true);
          this.productService.setHasChanges(true);
          this.nameChanged.emit(true);
        });
      }
    })
    this.changeInput('input__wrapper__' + inputId, cat.id)
  }

  resetUpdateIputs() {
    this.changingFilterId = undefined;
    document.querySelectorAll('.change-input__wrapper').forEach(elem => {
      elem.classList.add('d-none');
    })
  }

  deleteCategory(category_id: number) {
    this.categoryService.deleteCategory(category_id).subscribe(e => {
      console.log(e)
      this.categoryService.setHasChanges(true);
      this.productService.setHasChanges(true);
    });
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
}
