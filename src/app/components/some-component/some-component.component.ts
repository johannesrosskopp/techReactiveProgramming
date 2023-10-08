import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-some-component',
  templateUrl: './some-component.component.html',
  styleUrls: ['./some-component.component.scss'],
})
export class SomeComponentComponent {
  timesButtonClicked = 0;

  @Output() buttonClick = new EventEmitter<number>();

  buttonClicked() {
    this.timesButtonClicked++;
    this.buttonClick.emit(this.timesButtonClicked);
  }
}
