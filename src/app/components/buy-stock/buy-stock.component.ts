import { Component, OnInit } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  catchError,
  combineLatest,
  finalize,
  forkJoin,
  map,
  of,
  share,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  StockPriceDataService,
  StockPriceData,
} from 'src/app/services/stock-price-data.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss'],
})
export class BuyStockComponent implements OnInit {
  selectedStockAndAmount: StockSymbolAndAmountFormValue | null = null;
  stockPriceData: StockPriceData | null = null;

  // TODO Set this to true if the amount is not available
  showAmountNotAvailableWarning: boolean = false;

  // TODO Set this to true if the amount availbility check is loading
  isAmountAvailbilityLoading: boolean = false;
  isPriceLoading: boolean = false;

  private readonly stockAndAmountSelectionSubject =
    new ReplaySubject<StockSymbolAndAmountFormValue | null>(1);

  readonly reloadSubject = new BehaviorSubject<void>(undefined);

  constructor(
    private readonly stockPriceDataService: StockPriceDataService,
    private readonly accountService: AccountService
  ) {}

  ngOnInit() {
    this.stockAndAmountSelectionSubject.subscribe(selectedStockAndAmount => {
      this.selectedStockAndAmount = selectedStockAndAmount;
    });

    // TODO after you know the price amount, call this.accountService.isAmountAvailable(amount) and use the result
    // TODO this pipe could get too big, try to refactor it
    combineLatest([this.stockAndAmountSelectionSubject, this.reloadSubject])
      .pipe(
        switchMap(([selection, _]) =>
          selection ? this.loadStockPrice(selection) : of(null)
        ),
        catchError(err => {
          console.error('Fatal error occured, please reload!');
          return of(null);
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
      tap({
        subscribe: () => {
          this.isPriceLoading = true;
        },
      }),
      map(([sixPrice, xetraPrice]) =>
        sixPrice.price < xetraPrice.price ? sixPrice : xetraPrice
      ),
      catchError(err => {
        console.error('Loading stock price failed: ', err);
        return of(null);
      }),
      finalize(() => {
        this.isPriceLoading = false;
      })
    );
  }
}
