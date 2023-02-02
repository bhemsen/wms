import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() searchTerm: EventEmitter<string> = new EventEmitter;
  @Output() reset: EventEmitter<boolean> = new EventEmitter;
  @Input() isShoppingList = false;
    
  notifier$ = new Subject();

  searchForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required)
  })
  constructor() { }

  ngOnInit(): void {
    this.searchForm.valueChanges
    .pipe(
      takeUntil(this.notifier$),
      debounceTime(500), 
      filter(e => {
        console.log(e)
        if(e?.search?.length >= 2) {
          return e
        }
        this.reset.emit(true)

      })
      )
      .subscribe(val => {
        this.searchTerm.emit(val.search.toLowerCase())
    })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }

}
