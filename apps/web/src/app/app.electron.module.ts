import { NgModule } from '@angular/core';
import { LoclElectronCoreModule } from '@locl/app-electron';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [AppModule, LoclElectronCoreModule],
  bootstrap: [AppComponent]
})
export class AppElectronModule {}
