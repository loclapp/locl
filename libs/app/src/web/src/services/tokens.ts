import { InjectionToken } from '@angular/core';

/**
 * Various InjectionTokens shared across all platforms
 * Always suffix with 'Token' for clarity and consistency
 */

export const PlatformLanguageToken = new InjectionToken<string>(
  'PlatformLanguage'
);

export const PlatformWindowToken = new InjectionToken<string>(
  'PlatformWindow'
);
