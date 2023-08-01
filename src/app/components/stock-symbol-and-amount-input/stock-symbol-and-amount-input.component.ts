import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

interface StockSymbolAndAmountForm {
  symbolInput: FormControl<string>;
  amountInput: FormControl<number>;
}

export type StockSymbolAndAmountFormValue =
  FormGroup<StockSymbolAndAmountForm>['value'];

@Component({
  selector: 'app-stock-symbol-and-amount-input',
  templateUrl: './stock-symbol-and-amount-input.component.html',
  styleUrls: ['./stock-symbol-and-amount-input.component.scss'],
})
export class StockSymbolAndAmountInputComponent implements OnInit {
  stockInfoForm = new FormGroup<StockSymbolAndAmountForm>({
    symbolInput: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amountInput: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  filteredStockOptions$ =
    this.stockInfoForm.controls.symbolInput.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );

  stockOptions = ['AAPL', 'GOOG', 'TSLA', 'AMZN', 'FB'];

  @Output()
  selectedStockAndAmount: Observable<StockSymbolAndAmountFormValue> =
    this.stockInfoForm.valueChanges;

  ngOnInit(): void {
    this.stockInfoForm.valueChanges.subscribe(value => {
      console.log('form value changed to: ', value);
    });
  }
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stockOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
