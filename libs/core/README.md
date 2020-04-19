<p align="center"><img src="https://raw.githubusercontent.com/loclapp/locl/master/apps/web/src/assets/img/locl-social.png" width="450"></p>

# Locl Core

A library with various utility functions to help you with `$localize` (if you need help to get started with `$localize`, [read this](https://blog.ninja-squad.com/2019/12/10/angular-localize/)).

[Demo on StackBlitz](https://stackblitz.com/edit/ivy-ovy4cd) (it can take a long time to load the first time because ivy support on StackBlitz is still WIP).

## Installation

Install the core library with npm:

```sh
npm install @locl/core --save
```

## Usage

### Loading the translations at runtime

Angular translates the templates as soon as the components are loaded, which means that if you want to load the translations at runtime, you need to load them before the application starts.
The best way to do that, is to load the translations before `bootstrapModule` gets called.

`@locl/core` provides two functions to help you get the files over http:

- `getTranslations(url: string, method?: 'GET'|'POST', headers?: {[key: string]: string}, async?: boolean): Promise<ParsedTranslationBundle>`: Gets a translation file from a server using an XHR HTTP request
- `fetchTranslations(url: string, method?: 'GET'|'POST', headers?: {[key: string]: string}): Promise<ParsedTranslationBundle>`: Gets a translation file from a server using the fetch API (see [browser compatibility for the fetch API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))

Both methods return a promise with a `ParsedTranslationBundle` object containing the translations and the locale. Common usage is the following:

```ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getTranslations, ParsedTranslationBundle } from '@locl/core';
import { AppModule } from './app/app.module';

getTranslations('/assets/i18n/fr.json').then(
  (data: ParsedTranslationBundle) => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  }
);
```

- `loadTranslations(parsedTranslationBundle: ParsedTranslationBundle)`: Finishes initialization of \$localize, loads translations in memory and sets the `LOCALE_ID` value.
  Use this **only** if you're not using any of the two functions `getTranslations` or `fetchTranslations`.

### Util functions

- `getBrowserLang(): string`: Returns the current browser lang (e.g. "fr") if available, or an empty string otherwise
- `getBrowserCultureLang(): string`: Returns the current browser culture language name (e.g. "fr-FR") if available, or an empty string otherwise
