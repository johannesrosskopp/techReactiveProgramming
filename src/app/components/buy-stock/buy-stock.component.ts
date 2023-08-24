import { Component, OnInit } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss'],
})
export class BuyStockComponent implements OnInit {
  selectedStockAndAmount: StockSymbolAndAmountFormValue | null = null;

  // TODO create a subject that will hold the selected stock and amount
  // private readonly stockAndAmountSelectionSubject =

  constructor() {}

  // TODO remove this eslint-disabler
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    // TODO subscribe to the subject and update the 'selectedStockAndAmount' variable
  }

  onStockAndAmountSelectionChange(
    selection: StockSymbolAndAmountFormValue | null
  ) {
    // TODO insert the selection into the subject
  }

  onSearchStockBtnClicked() {
    // TODO subscribe to the subject limited to one emission (take(1)) and use following code to open a new tab with the google search
    // window.open(
    //   `https://www.google.com/search?q=${selectedStockAndAmount?.symbolInput}`
    // );
  }
}
