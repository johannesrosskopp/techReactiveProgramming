import { Component } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import {
  StockPriceData,
  StockPriceDataService,
} from 'src/app/services/stock-price-data.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss'],
})
export class BuyStockComponent {
  selectedStockAndSymbol: StockSymbolAndAmountFormValue | null = null;
  stockPriceData: StockPriceData | null = null;
  showLoading: boolean = false;
  showAmountNotAvailableWarning: boolean = false;

  constructor(
    private readonly stockPriceDataService: StockPriceDataService,
    private readonly accountService: AccountService
  ) {}

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

  onReload() {
    this.loadStockPrice(this.selectedStockAndSymbol!);
  }

  private loadStockPrice(selection: StockSymbolAndAmountFormValue) {
    this.showLoading = true;
    this.showAmountNotAvailableWarning = false;
    this.stockPriceDataService
      .getStockPriceData(selection.symbolInput, selection.amountInput)
      .subscribe(stockPriceData => {
        this.stockPriceData = stockPriceData;

        this.accountService
          .isAmountAvailable(stockPriceData.price)
          .subscribe(isAmountAvailable => {
            this.showLoading = false;
            this.showAmountNotAvailableWarning = !isAmountAvailable;
          });
      });
  }
}
