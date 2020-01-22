/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedMessage } from '@angular/localize';
import { TranslationSerializer } from './translation_serializer';

interface SimpleJsonTranslationFile {
  locale: string;
  translations: Record<string, string>;
}

export class JsonTranslationSerializer implements TranslationSerializer {
  renderFile(messages: ɵParsedMessage[], locale: string): string {
    const fileObj: SimpleJsonTranslationFile = {
      locale,
      translations: {}
    };
    messages.forEach(message => {
      fileObj.translations[message.messageId] = message.messageString;
    });
    return JSON.stringify(fileObj, null, 2);
  }
}
