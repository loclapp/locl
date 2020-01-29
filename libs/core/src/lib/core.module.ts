import { ɵMessageId, ɵTargetMessage } from '@angular/localize';

export function parseTranslations(
  fileContent: string
): ParsedTranslationBundle {
  let data: ParsedTranslationBundle;

  // Test if the content is json
  if (
    /^[\],:{}\s]*$/.test(
      fileContent
        .replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          ']'
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    )
  ) {
    data = JSON.parse(fileContent);
  } else {
    throw new Error('Only JSON translation files are supported at the moment');
  }
  return data;
}

/**
 * Gets a translation file from a server using an XHR HTTP request
 * @param url
 * @param method the method used to get the translations, either `GET` or `POST`
 * @param headers an object containing a list of header/value to set for the XHR request
 * @param async defines if the XHR request should be async (default) or not
 */
export function getTranslations(
  url,
  method: 'GET' | 'POST' = 'GET',
  headers: { [key: string]: string } = {},
  async = true
): Promise<ParsedTranslationBundle> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
      try {
        resolve(parseTranslations(xhr.responseText));
      } catch (e) {
        reject(e);
      }
    };

    xhr.onerror = function() {
      reject(new Error('Network request failed'));
    };

    xhr.ontimeout = function() {
      reject(new Error('Network request timeout'));
    };

    xhr.onabort = function() {
      reject(new Error('Network request aborted'));
    };

    Object.keys(headers).forEach(key =>
      xhr.setRequestHeader(key, headers[key])
    );
    xhr.open(method, url, async);
    xhr.send();
  });
}

export interface ParsedTranslationBundle {
  locale: string;
  translations: Record<ɵMessageId, ɵTargetMessage>;
}

/**
 * Gets a translation file from a server using the fetch API
 * @param url
 * @param method the method used to get the translations, either `GET` or `POST`
 * @param headers an object containing a list of header/value to set for the XHR request
 */
export function fetchTranslations(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  headers: { [key: string]: string } = {}
): Promise<ParsedTranslationBundle> {
  return fetch(url, { method, headers })
    .then(response => response.text())
    .then((response: string) => {
      return parseTranslations(response);
    });
}

/**
 * Returns the language code name from the browser, e.g. "fr"
 */
export function getBrowserLang(): string {
  if (
    typeof window === 'undefined' ||
    typeof window.navigator === 'undefined'
  ) {
    return '';
  }

  return getBrowserCultureLang().split('-')[0];
}

/**
 * Returns the culture language code name from the browser, e.g. "fr-FR"
 */
export function getBrowserCultureLang(): string {
  if (
    typeof window === 'undefined' ||
    typeof window.navigator === 'undefined'
  ) {
    return '';
  }

  let browserCultureLang = window.navigator.languages
    ? window.navigator.languages[0]
    : null;
  browserCultureLang =
    browserCultureLang ||
    window.navigator.language ||
    (window.navigator as any).browserLanguage ||
    (window.navigator as any).userLanguage;

  return browserCultureLang.replace(/_/g, '-');
}
