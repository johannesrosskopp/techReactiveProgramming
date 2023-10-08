import { Injectable } from '@angular/core';
import { StockSymbol } from '../constants/availableStocks';
import { Observable, delay, of, switchMap, throwError } from 'rxjs';

const getRandomlyTrueOrFalse = () => Math.random() > 0.5;

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

  getPriceFromSIX(
    symbol: StockSymbol,
    amount: number
  ): Observable<StockPriceData> {
    console.log('StockPriceDataService: loading price from SIX');
    return this.getStockPriceData(symbol, amount);
  }

  getPriceFromSIXWithError(
    symbol: StockSymbol,
    amount: number
  ): Observable<StockPriceData> {
    const fakeDelayMs = Math.random() * 1000;
    return this.getPriceFromSIX(symbol, amount).pipe(
      switchMap(price =>
        getRandomlyTrueOrFalse()
          ? throwError(() => new Error('SIX is down'))
          : of(price)
      )
    );
  }

  getPriceFromXETRA(
    symbol: StockSymbol,
    amount: number
  ): Observable<StockPriceData> {
    console.log('StockPriceDataService: loading price from XETRA');
    return this.getStockPriceData(symbol, amount);
  }

  getPriceFromXETRAWithError(
    symbol: StockSymbol,
    amount: number
  ): Observable<StockPriceData> {
    const fakeDelayMs = Math.random() * 1000;
    return this.getPriceFromSIX(symbol, amount).pipe(
      switchMap(price =>
        getRandomlyTrueOrFalse()
          ? throwError(() => new Error('XETRA is down'))
          : of(price)
      )
    );
  }

  loadCapConfig(symbolInput: string): Observable<{ isOk: boolean }> {
    return of({ isOk: true });
  }

  private getStockPriceData(
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
