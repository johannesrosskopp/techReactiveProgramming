import { Component, OnInit } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  catchError,
  combineLatest,
  concatMap,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
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

  // Setting this boolean will control loading state in the template
  isPriceLoading: boolean = false;

  private readonly stockAndAmountSelectionSubject =
    new ReplaySubject<StockSymbolAndAmountFormValue | null>(1);

  readonly reloadSubject = new BehaviorSubject<void>(undefined);

  constructor(private readonly stockPriceDataService: StockPriceDataService) {}

  ngOnInit() {
    this.stockAndAmountSelectionSubject.subscribe(selectedStockAndAmount => {
      this.selectedStockAndAmount = selectedStockAndAmount;
    });

    // TODO add error handling, notice there is no error variable. Use 'getPriceFromSIXWithError()' to simulate errors
    // TODO add loading logic by setting the isPriceLoading variable
    combineLatest([this.stockAndAmountSelectionSubject, this.reloadSubject])
      .pipe(
        tap(console.log),
        tap(() => (this.isPriceLoading = true)),
        switchMap(([selection, _]) =>
          selection ? this.loadStockPrice(selection) : of(null)
        )
      )
      .subscribe(stockPriceData => {
        this.stockPriceData = stockPriceData;
        this.isPriceLoading = false;
      });

    let testsubj = new Subject<string>();
    let delaySubject = new Subject<string>();
    testsubj
      .pipe(
        tap({
          next: val => console.log(`Tap Test ${val}`),
          error: val => console.log(`Tap Test Error ${val}`),
        }),
        switchMap(val => {
          setTimeout(() => delaySubject.next(val), 2000);
          return delaySubject;
        }),
        tap({
          next: val => console.log(`Tap2 Test ${val}`),
          error: val => console.log(`Tap Test Error2 ${val}`),
        })
      )
      .subscribe(val => console.log(`Subscribe TEST ${val}`));

    for (let i = 0; i < 10; i++) {
      testsubj.next(`input ${i}`);
    }
    testsubj.error('error_input');
    for (let i = 0; i < 10; i++) {
      testsubj.next(`input ${i}`);
    }
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

  private loadStockPrice(
    selection: StockSymbolAndAmountFormValue
  ): Observable<StockPriceData | null> {
    return forkJoin([
      this.stockPriceDataService.getPriceFromSIXWithError(
        selection.symbolInput,
        selection.amountInput
      ),
      this.stockPriceDataService.getPriceFromXETRA(
        selection.symbolInput,
        selection.amountInput
      ),
    ]).pipe(
      map(([sixPrice, xetraPrice]) =>
        sixPrice.price < xetraPrice.price ? sixPrice : xetraPrice
      ),
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }
}
