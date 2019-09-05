import { NgModule } from '@angular/core';
import { LoclElectronCoreModule } from '@locl/app-electron';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [AppModule, LoclElectronCoreModule],
  bootstrap: [AppComponent]
})
export class AppElectronModule {
}
