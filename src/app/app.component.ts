import { Component, OnInit } from '@angular/core';
import { ButtonClickStatsService } from './services/button-click-stats.service';
import { map } from 'rxjs';

type ButtonClickStats = {
  timesButtonClicked: number;
  latestRecord: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Button Click Stats';

  // TODO try not to assign any value
  // TODO overwrite nullability check with ! operator
  // TODO try to change type to also null, then fix problems
  buttonClickStats: ButtonClickStats = {
    timesButtonClicked: 0,
    latestRecord: 0,
  };

  constructor(private buttonClickStatsService: ButtonClickStatsService) {}

  ngOnInit() {
    const latestRecord = this.buttonClickStatsService.loadLatestRecordSync();
    this.buttonClickStats = {
      ...this.buttonClickStats,
      latestRecord: latestRecord,
    };
  }

  onButtonClick(timesButtonClicked: number) {
    this.buttonClickStats = {
      ...this.buttonClickStats,
      timesButtonClicked,
    };
  }

  // Different lamda function styles
  someLamdaFunction = (a: number, b: number) => {
    return a + b;
  };

  lamdaWithoutParans = a => {
    return a + 1;
  };

  lamdaWithoutReturn = (a: number, b: number) => a + b;

  lamdaWithReturnObject = (a: number, b: number) => ({
    result: a + b,
  });

  lamdaWithArrayInput = (inputs: string[]) => {
    return inputs.length;
  };

  lamdaWithDestructuredArrayInput = ([first, second]: string[]) => {
    return first + second;
  };
}

// // loading async
// this.buttonClickStatsService.loadLatestRecord().subscribe(latestRecord => {
//   this.buttonClickStats = {
//     ...this.buttonClickStats,
//     latestRecord: latestRecord,
//   };
// });

//  // Subcribing and piping
//  this.buttonClickStatsService
//  .loadLatestRecordAsString()
//  .pipe(
//    map(latestRecord => {
//      return parseInt(latestRecord, 10);
//    })
//  )
//  .subscribe(latestRecord => {
//    this.buttonClickStats = {
//      ...this.buttonClickStats,
//      latestRecord: latestRecord,
//    };
//  });
