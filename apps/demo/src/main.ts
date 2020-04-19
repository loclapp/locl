import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getTranslations, ParsedTranslationBundle } from '@locl/core';
import { AppModule } from './app/app.module';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

getTranslations('/assets/i18n/fr.json').then(
  (data: ParsedTranslationBundle) => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  }
);
