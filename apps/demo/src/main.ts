import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { fetchTranslations } from '@locl/core';
import { AppModule } from './app/app.module';

import { environment } from './environments/environment';
import './i18n-setup';

if (environment.production) {
  enableProdMode();
}
fetchTranslations('/assets/i18n/fr.json').then(() => {
  // import('./app/app.module').then(module => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
  // });
});
