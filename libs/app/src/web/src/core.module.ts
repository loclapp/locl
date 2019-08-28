import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { throwIfAlreadyLoaded } from '@locl/utils';
// libs
import {
  CORE_PROVIDERS,
  PlatformLanguageToken,
  PlatformWindowToken,
  WindowPlatformService
} from './services';

// bring in custom web services here...

// factories
export function winFactory() {
  return window;
}

export function platformLangFactory() {
  const browserLang = window.navigator.language || 'en'; // fallback English
  // browser language has 2 codes, ex: 'en-US'
  return browserLang.split('-')[0];
}

export const BASE_PROVIDERS: any[] = [
  ...CORE_PROVIDERS,
  {
    provide: APP_BASE_HREF,
    useValue: '/'
  }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    ...BASE_PROVIDERS, {
      provide: PlatformLanguageToken,
      useFactory: platformLangFactory
    }, {
      provide: PlatformWindowToken,
      useFactory: winFactory
    }, {
      provide: WindowPlatformService,
      useFactory: winFactory
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
