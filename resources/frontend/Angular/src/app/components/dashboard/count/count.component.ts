import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { ProductService } from 'src/app/product.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() isShoppingList: boolean = false;

  @Output() hasChanges: EventEmitter<boolean> = new EventEmitter()

  notifier$ = new Subject();
  amountForm!: FormGroup;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.amountForm = new FormGroup({
      amount: new FormControl(this.product?.count, [
        Validators.required,
        Validators.min(0)
      ])
    })

    this.amountForm.valueChanges.pipe(
      takeUntil(this.notifier$),
      distinctUntilChanged(),
      debounceTime(500),
      switchMap(amount => {
        if(this.amountForm.invalid){
          this.amountForm.markAllAsTouched();
          throw new Error('Die Eingabe ist ungültig')
        }
        if(this.isShoppingList) {
        return this.productService.updateProductCountShoppingList(this.product, amount.amount)
        }
        return this.productService.updateProductCount(this.product, amount.amount)
      })
      ).subscribe(e => {
        console.log(e)
          this.hasChanges.emit(true)
          this.productService.setHasChanges(null);
      })
  }

  ngOnDestroy(): void {
    this.notifier$.next(null);
    this.notifier$.complete();
  }


  lowerAmount():void {
    let amount = this.amountForm.get('amount')?.value
    if(amount >= 1) {
      amount--;
      this.amountForm.patchValue({amount: amount})
    }
  }

  higherAmount():void {
    let amount = this.amountForm.get('amount')?.value
    amount++;
    this.amountForm.patchValue({amount: amount})
  }

}
