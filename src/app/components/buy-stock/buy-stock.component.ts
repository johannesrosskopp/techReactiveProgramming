import { Component, OnInit } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import { Observable, ReplaySubject, filter, of, switchMap, take } from 'rxjs';
import {
  StockPriceDataService,
  StockPriceData,
} from 'src/app/services/stock-price-data.service';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss'],
})
export class BuyStockComponent implements OnInit {
  selectedStockAndAmount: StockSymbolAndAmountFormValue | null = null;
  stockPriceData: StockPriceData | null = null;

  private readonly stockAndAmountSelectionSubject =
    new ReplaySubject<StockSymbolAndAmountFormValue | null>(1);

  // Notice how the service is injected into the component.
  // It is now available just like class variable. Thx Typescript and Angular! :)
  constructor(private readonly stockPriceDataService: StockPriceDataService) {}

  ngOnInit() {
    this.stockAndAmountSelectionSubject.subscribe(selectedStockAndAmount => {
      this.selectedStockAndAmount = selectedStockAndAmount;
    });

    // TODO use stockPriceDataService and an async mapper to load the stock price from SIX
    // then subscribe and set the stockPriceData variable
    this.stockAndAmountSelectionSubject
      .pipe(
        switchMap(selectedStockAndAmount => {
          if (!selectedStockAndAmount) {
            return of(null);
          }
          return this.stockPriceDataService.getPriceFromSIX(
            selectedStockAndAmount?.symbolInput,
            selectedStockAndAmount?.amountInput
          );
        })
      )
      .subscribe(stockPriceData => {
        this.stockPriceData = stockPriceData;
      });
  }

  onStockAndAmountSelectionChange(
    selection: StockSymbolAndAmountFormValue | null
  ) {
    this.stockAndAmountSelectionSubject.next(selection);
  }

  onSearchStockBtnClicked() {
    this.stockAndAmountSelectionSubject
      .pipe(take(1))
      .subscribe(selectedStockAndAmount => {
        console.log('open google search for', selectedStockAndAmount);
        window.open(
          `https://www.google.com/search?q=${selectedStockAndAmount?.symbolInput}`
        );
      });
  }
}
