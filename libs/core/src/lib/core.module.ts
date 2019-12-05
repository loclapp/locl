// import { NgModule } from '@angular/core';
//
// @NgModule({
//   imports: []
// })
// export class LoclCoreModule {
// }

import { loadTranslations } from '@angular/localize';
import { ɵMessageId, ɵTargetMessage } from '@angular/localize';

function getJSON(url): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
      console.log(this.responseText);
      resolve(this.responseText);
    };

    xhr.onload = function() {
      resolve(JSON.parse(xhr.responseText));
    };

    xhr.onerror = function() {
      reject('Network request failed');
    };

    xhr.ontimeout = function() {
      reject('Network request failed');
    };

    xhr.onabort = function() {
      reject('Aborted');
    };

    xhr.open('GET', url, true);
    xhr.send();
  });
}

export interface JSONTranslationsFile {
  locale: string;
  translations: Record<ɵMessageId, ɵTargetMessage>;
}

export function fetchTranslations(url: string): Promise<JSONTranslationsFile> {
  return fetch(url)
    .then(response => response.json())
    .then((data: JSONTranslationsFile) => {
      loadTranslations(data.translations);
      return data;
    });
}
