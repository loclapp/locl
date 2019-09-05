import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// app
import { AppElectronModule } from './app/app.electron.module';
// libs
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppElectronModule)
  .catch(err => console.log(err));
