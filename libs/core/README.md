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

Both methods return a promise with a `ParsedTranslationBundle` object containing the translations. Common usage is the following:

```ts
// Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
import '@angular/localize/init';

import { loadTranslations } from '@angular/localize';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getTranslations, ParsedTranslationBundle } from '@locl/core';

getTranslations('/assets/i18n/fr.json').then(
  (data: ParsedTranslationBundle) => {
    loadTranslations(data.translations);
    import('./app/app.module').then(module => {
      platformBrowserDynamic()
        .bootstrapModule(module.AppModule)
        .catch(err => console.error(err));
    });
  }
);
```

:warning: Do not forget to call `loadTranslations` to load the translations into `$localize`.

You can notice that we are loading the app module as a dynamic import after the translations have been loaded.
The reason for that is that, in AOT mode, `$localize` calls are defined as constants outside of the template creation.
This means that `$localize` will try to find the translations as soon as the module is imported, which would be when the app is loaded
in the case of a regular import. By using a dynamic import we ensure that the translations are loaded before the module.

### Util functions

- `getBrowserLang(): string`: Returns the current browser lang (e.g. "fr") if available, or an empty string otherwise
- `getBrowserCultureLang(): string`: Returns the current browser culture language name (e.g. "fr-FR") if available, or an empty string otherwise
