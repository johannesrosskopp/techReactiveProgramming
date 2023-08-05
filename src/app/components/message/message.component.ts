import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message: string | null = null;
  @Input() type: 'error' | 'warning' | 'info' = 'info';

  typeToIconMap: {[key in MessageComponent['type']]: string} = {
    error: 'error_outline',
    warning: 'warning',
    info: 'info',
  };

}
