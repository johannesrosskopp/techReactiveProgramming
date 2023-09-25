import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor() {}

  private readonly FAKE_AVAILABLE_AMOUNT = 1000;
  private readonly FAKE_DELAY_MS = 1000;

  isAmountAvailable(amount: number): Observable<boolean> {
    const isAmountAvailable = amount <= this.FAKE_AVAILABLE_AMOUNT;
    console.log('loading amount availability...');
    return of(isAmountAvailable).pipe(delay(this.FAKE_DELAY_MS));
  }
}
