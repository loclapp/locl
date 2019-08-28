import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from '@locl/app-web';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
