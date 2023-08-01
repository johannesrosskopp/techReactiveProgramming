import { Component } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss']
})
export class BuyStockComponent {
  stockAndSymbol: StockSymbolAndAmountFormValue = {};

  stockAndAmountSelectionChanged(selection: StockSymbolAndAmountFormValue) {
    this.stockAndSymbol = selection;
  }

}
