import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SomeComponentComponent } from './components/some-component/some-component.component';

@NgModule({
  declarations: [AppComponent, SomeComponentComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
