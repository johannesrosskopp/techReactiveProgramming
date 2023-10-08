import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonClickStatsService {
  constructor() {}

  public loadLatestRecordSync(): number {
    return 20;
  }

  public loadLatestRecord(): Observable<number> {
    return of(20);
  }
  public loadLatestRecordAsString(): Observable<string> {
    return of('20');
  }
}
