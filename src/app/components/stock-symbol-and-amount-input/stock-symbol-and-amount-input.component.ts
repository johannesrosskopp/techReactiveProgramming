import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Observable,
  combineLatest,
  distinct,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { StockSymbol, stockOptions } from 'src/app/constants/availableStocks';

interface StockSymbolAndAmountForm {
  symbolInput: FormControl<StockSymbol | null>;
  amountInput: FormControl<number | null>;
}

export type StockSymbolAndAmountFormValue = {
  symbolInput: StockSymbol;
  amountInput: number;
};
@Component({
  selector: 'app-stock-symbol-and-amount-input',
  templateUrl: './stock-symbol-and-amount-input.component.html',
  styleUrls: ['./stock-symbol-and-amount-input.component.scss'],
})
export class StockSymbolAndAmountInputComponent implements OnInit {
  stockInfoForm = new FormGroup<StockSymbolAndAmountForm>({
    symbolInput: new FormControl(null, {
      nonNullable: false,
      validators: [Validators.required],
    }),
    amountInput: new FormControl(null, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  filteredStockOptions$ =
    this.stockInfoForm.controls.symbolInput.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );

  @Output()
  selectedStockAndAmount: Observable<StockSymbolAndAmountFormValue | null> =
    this.getFormValueOrNull();

  ngOnInit(): void {
    this.stockInfoForm.valueChanges.subscribe(value => {
      console.log('form value changed to: ', value);
    });
    this.stockInfoForm.statusChanges.subscribe(status => {
      console.log('form status changed to: ', status);
    });
  }

  onMinusClick(event: MouseEvent): void {
    this.stockInfoForm.controls.amountInput.setValue(
      (this.stockInfoForm.controls.amountInput.value || 0) - 1
    );
    event.stopPropagation();
  }

  onPlusClick(event: MouseEvent): void {
    this.stockInfoForm.controls.amountInput.setValue(
      (this.stockInfoForm.controls.amountInput.value || 0) + 1
    );
    event.stopPropagation();
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return stockOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private getFormValueOrNull(): Observable<StockSymbolAndAmountFormValue | null> {
    return this.stockInfoForm.statusChanges.pipe(
      distinctUntilChanged(),
      switchMap(status => {
        return status === 'VALID'
          ? this.stockInfoForm.valueChanges.pipe(
              startWith(this.stockInfoForm.value),
              map(value => value as StockSymbolAndAmountFormValue)
            )
          : of(null);
      })
    );
  }
}
