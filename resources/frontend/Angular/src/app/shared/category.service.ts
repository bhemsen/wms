import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { Category } from './interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnInit, OnDestroy {

  categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  categories: Category[] = [];
  hasChanges$: Subject<any> = new Subject();

  notifier$ = new Subject()

  constructor(private dbService: DatabaseService) {
    this.dbService.getUserCategories().pipe(takeUntil(this.notifier$)).subscribe(categories => {
      console.log(categories)
      this.categories$.next(categories);
      this.categories = categories;
    })

    this.hasChanges$.pipe(
      takeUntil(this.notifier$),
      switchMap(() => {
        return this.dbService.getUserCategories()
      })
    ).subscribe(categories => {
      this.categories$.next(categories);
      this.categories = categories;
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

  setHasChanges(val: any): void {
    this.hasChanges$.next(val);

  }

  getHasChanges(): Subject<any> {
    return this.hasChanges$;
  }

  getCategories$(): Subject<Category[]> {
    return this.categories$;
  }

  deleteCategory(categoryId: number) {
    return this.dbService.deleteCategory(categoryId.toString());
  }
}
