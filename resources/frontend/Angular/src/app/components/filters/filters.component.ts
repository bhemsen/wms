import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
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
export class FiltersComponent implements OnInit, OnDestroy {

  @Output() activeFilter: EventEmitter<string> = new EventEmitter();

  filterForm: FormGroup = new FormGroup({
    filter: new FormControl('all')
  });

  addCategory: FormControl = new FormControl('',Validators.required)

  hasChanges$ = new Subject();

  notifier$ = new Subject();
  filters: Category[] = [];
  filters$: Subject<Category[]> = new Subject();

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {
    this.dbService.getAllCategories().pipe(takeUntil(this.notifier$)).subscribe(categories => {
      this.filters$.next(categories);
    });

    this.filterForm.valueChanges.pipe(takeUntil(this.notifier$)).subscribe(e => {
      this.activeFilter.emit(e.filter)
    })

    this.hasChanges$.pipe(
      takeUntil(this.notifier$),
      switchMap(()=> {
        return this.dbService.getAllCategories()
      })
    ).subscribe((filters)=> {
      this.filters$.next(filters);
    })

    this.filters$.pipe(takeUntil(this.notifier$)).subscribe(e => {
      this.filters = e;
      this.filterForm.patchValue({filter: 'all'});
    })
  }

  addNewCategory() {
    const cat = this.addCategory.value
    if (cat.length > 0) {
      console.log(cat)
      this.dbService.addCategory(cat).pipe(takeUntil(this.notifier$)).subscribe(e => {
        this.filterForm.reset();
        this.hasChanges$.next(true)
      })
    }
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
}
