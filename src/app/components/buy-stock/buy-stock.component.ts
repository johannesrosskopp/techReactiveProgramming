import { Component, OnInit } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import { ReplaySubject, Subject, Subscription, take } from 'rxjs';
import { StockSymbol } from 'src/app/constants/availableStocks';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss'],
})
export class BuyStockComponent implements OnInit {
  selectedStockAndAmount: StockSymbolAndAmountFormValue | null = null;

  // TODO create a subject that will hold the selected stock and amount
  private readonly stockAndAmount$ =
    new ReplaySubject<StockSymbolAndAmountFormValue>(1);

  constructor() {}

  // TODO remove this eslint-disabler
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    // TODO subscribe to the subject and update the 'selectedStockAndAmount' variable
    this.stockAndAmount$.subscribe(selectedStockAndAmount => {
      this.selectedStockAndAmount = selectedStockAndAmount;
    });
  }

  onStockAndAmountSelectionChange(
    selection: StockSymbolAndAmountFormValue | null
  ) {
    if (selection) {
      this.stockAndAmount$.next(selection);
    }
  }

  onSearchStockBtnClicked() {
    // TODO subscribe to the subject limited to one emission (take(1)) and use following code to open a new tab with the google search
    //this.stockAndAmount$.pipe(take(1)).subscribe(selectedStockAndAmount => {
    //  this.selectedStockAndAmount = selectedStockAndAmount;
    //});

    window.open(
      `https://www.google.com/search?q=${this.selectedStockAndAmount?.symbolInput}`
    );
  }
}
