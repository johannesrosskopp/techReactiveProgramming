import { Injectable } from '@angular/core';
import { StockSymbol } from '../constants/availableStocks';
import { Observable, delay, of } from 'rxjs';

export interface StockPriceData {
  symbol: StockSymbol;
  amount: number;
  price: number;
}

const stockToPriceRange: { [K in StockSymbol]: { min: number; max: number } } =
  {
    AAPL: { min: 199, max: 200 },
    AMZN: { min: 11, max: 12 },
    FB: { min: 4, max: 5 },
    GOOG: { min: 20, max: 21 },
    TSLA: { min: 79, max: 80 },
  };

@Injectable({
  providedIn: 'root',
})
export class StockPriceDataService {
  constructor() {}

  getStockPriceData(
    symbol: StockSymbol,
    amount: number
  ): Observable<StockPriceData> {
    const singlePrice =
      Math.random() *
        (stockToPriceRange[symbol].max - stockToPriceRange[symbol].min) +
      stockToPriceRange[symbol].min;

    const stockPriceData: StockPriceData = {
      symbol,
      amount,
      price: singlePrice * amount,
    };

    const fakeDelayMs = Math.random() * 1000;

    return of(stockPriceData).pipe(delay(fakeDelayMs));
  }
}
