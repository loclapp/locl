import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@locl/app-web';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
