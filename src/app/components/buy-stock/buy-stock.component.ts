import { Component, OnInit } from '@angular/core';
import { StockSymbolAndAmountFormValue } from '../stock-symbol-and-amount-input/stock-symbol-and-amount-input.component';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  forkJoin,
  map,
  of,
  switchMap,
  take,
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

  private readonly stockAndAmountSelectionSubject =
    new ReplaySubject<StockSymbolAndAmountFormValue | null>(1);

  // Notice that we have new subject.
  // The 'next' call to insert the 'reload clicked' event is already done for you (in the template).
  readonly reloadSubject = new BehaviorSubject<void>(undefined);

  constructor(private readonly stockPriceDataService: StockPriceDataService) {}

  ngOnInit() {
    this.stockAndAmountSelectionSubject.subscribe(selectedStockAndAmount => {
      this.selectedStockAndAmount = selectedStockAndAmount;
    });

    // TODO: choose a combiner to combine the stockAndAmountSelectionSubject and reloadSubject
    combineLatest([this.stockAndAmountSelectionSubject, this.reloadSubject])
      .pipe(
        // TODO: adjust the switchMap. It should receive an array of values now!
        switchMap(([selection, _]) =>
          selection ? this.loadStockPrice(selection) : of(null)
        )
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
  ): Observable<StockPriceData> {
    // TODO: additionally load the price from XETRA and return the lower price of the two
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
      )
    );
  }
}
