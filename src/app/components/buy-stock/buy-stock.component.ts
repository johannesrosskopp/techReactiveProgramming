import { Component, OnInit } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import {
  StockPriceData,
  StockPriceDataService,
} from 'src/app/services/stock-price-data.service';
import { AccountService } from 'src/app/services/account.service';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  catchError,
  combineLatest,
  finalize,
  forkJoin,
  map,
  of,
  share,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Component({
  selector: 'app-buy-stock',
  templateUrl: './buy-stock.component.html',
  styleUrls: ['./buy-stock.component.scss'],
})
export class BuyStockComponent implements OnInit {
  selectedStockAndAmount: StockSymbolAndAmountFormValue | null = null;
  stockPriceData: StockPriceData | null = null;
  showAmountNotAvailableWarning: boolean = false;

  isAmountAvailbilityLoading: boolean = false;
  isPriceLoading: boolean = false;

  readonly stockAndAmountSelectionSubject =
    new ReplaySubject<StockSymbolAndAmountFormValue | null>(1);

  readonly reloadSubject = new BehaviorSubject<void>(undefined);

  constructor(
    private readonly stockPriceDataService: StockPriceDataService,
    private readonly accountService: AccountService
  ) {}

  stockPriceData$: Observable<StockPriceData | null> = combineLatest([
    this.stockAndAmountSelectionSubject,
    this.reloadSubject,
  ]).pipe(
    tap(() => {
      this.showAmountNotAvailableWarning = false;
    }),
    switchMap(([selection, _]) =>
      selection ? this.loadStockPrice(selection) : of(null)
    ),
    share()
  );

  showAmountNotAvailableWarning$: Observable<boolean> =
    this.stockPriceData$.pipe(
      switchMap(stockPriceData =>
        stockPriceData
          ? this.loadAmountAvailability(stockPriceData.price).pipe(
              map(isAmountAvailable => !isAmountAvailable)
            )
          : of(false)
      )
    );

  ngOnInit() {
    this.stockAndAmountSelectionSubject.subscribe(selectedStockAndAmount => {
      this.selectedStockAndAmount = selectedStockAndAmount;
    });

    this.stockPriceData$.subscribe(stockPriceData => {
      this.stockPriceData = stockPriceData;
    });

    this.showAmountNotAvailableWarning$.subscribe(
      showAmountNotAvailableWarning => {
        this.showAmountNotAvailableWarning = showAmountNotAvailableWarning;
      }
    );
  }

  private loadStockPrice(
    selection: StockSymbolAndAmountFormValue
  ): Observable<StockPriceData> {
    this.isPriceLoading = true;

    return forkJoin([
      this.stockPriceDataService.getPriceFromSIX(
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
      tap(() => {
        this.isPriceLoading = false;
      })
    );
  }

  private loadAmountAvailability(amount: number): Observable<boolean> {
    this.isAmountAvailbilityLoading = true;
    return this.accountService.isAmountAvailable(amount).pipe(
      tap(() => {
        this.isAmountAvailbilityLoading = false;
      })
    );
  }
}
