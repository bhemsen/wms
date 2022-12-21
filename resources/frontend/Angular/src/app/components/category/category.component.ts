import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatabaseService } from 'src/app/shared/database.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  notifier$ = new Subject()
  addCategoryForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {
  }

  submitForm(): void {
    if(this.addCategoryForm.invalid){
      this.addCategoryForm.markAllAsTouched();
      return
    }
    this.dbService.addCategory(this.addCategoryForm.get('name')?.value).pipe(takeUntil(
      this.notifier$
    )).subscribe(res => {
      console.log(res)
      this.addCategoryForm.reset();
    })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete()
  }
}
