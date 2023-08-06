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
  isPriceLoading: boolean = false;
  showAmountNotAvailableWarning: boolean = false;
  isAmountAvailbilityLoading: boolean = false;

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
    this.isPriceLoading = true;
    this.showAmountNotAvailableWarning = false;
    this.stockPriceDataService
      .getStockPriceData(selection.symbolInput, selection.amountInput)
      .subscribe(stockPriceData => {
        this.stockPriceData = stockPriceData;
        this.isPriceLoading = false;
        this.loadAmountAvailability(stockPriceData.price);
      });
  }

  private loadAmountAvailability(amount: number) {
    this.isAmountAvailbilityLoading = true;
    this.accountService
      .isAmountAvailable(amount)
      .subscribe(isAmountAvailable => {
        this.showAmountNotAvailableWarning = !isAmountAvailable;
        this.isAmountAvailbilityLoading = false;
      });
  }
}
