import { Component } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import {
  StockPriceData,
  StockPriceDataService,
} from 'src/app/services/stock-price-data.service';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss'],
})
export class BuyStockComponent {
  selectedStockAndSymbol: StockSymbolAndAmountFormValue | null = null;
  stockPriceData: StockPriceData | null = null;
  stockPriceDataLoading: boolean = false;

  constructor(readonly stockPriceDataService: StockPriceDataService) {}

  stockAndAmountSelectionChanged(
    selection: StockSymbolAndAmountFormValue | null
  ) {
    this.selectedStockAndSymbol = selection;
    if (selection) {
      this.loadStockPrice(selection);
    } else {
      this.stockPriceData = null;
    }
  }

  private loadStockPrice(selection: StockSymbolAndAmountFormValue) {
    this.stockPriceDataLoading = true;
    this.stockPriceDataService
      .getStockPriceData(selection.symbolInput, selection.amountInput)
      .subscribe(stockPriceData => {
        this.stockPriceData = stockPriceData;
        this.stockPriceDataLoading = false;
      });
  }
}
