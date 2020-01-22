/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedMessage } from '@angular/localize';
import { TranslationSerializer } from './translation_serializer';
import { XmlFile } from './xml_file';

const DOCTYPE = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE translationbundle [
<!ELEMENT translationbundle (translation)*>
<!ATTLIST translationbundle lang CDATA #REQUIRED>

<!ELEMENT translation (#PCDATA|ph)*>
<!ATTLIST translation id CDATA #REQUIRED>
<!ATTLIST translation desc CDATA #IMPLIED>
<!ATTLIST translation meaning CDATA #IMPLIED>
<!ATTLIST translation xml:space (default|preserve) "default">

<!ELEMENT ph (#PCDATA|ex)*>
<!ATTLIST ph name CDATA #REQUIRED>

<!ELEMENT ex (#PCDATA)>
]>
`;

export class XtbTranslationSerializer implements TranslationSerializer {
  renderFile(messages: ɵParsedMessage[], locale: string): string {
    const xml = new XmlFile();
    xml.startTag('translationbundle', { lang: locale });
    messages.forEach(message => {
      xml.startTag(
        'translation',
        {
          id: message.messageId,
          desc: message.description,
          meaning: message.meaning
        },
        { preserveWhitespace: true }
      );
      this.renderMessage(xml, message);
      xml.endTag('translation', { preserveWhitespace: false });
    });
    xml.endTag('translationbundle');
    return DOCTYPE + xml.toString();
  }

  private renderMessage(xml: XmlFile, message: ɵParsedMessage): void {
    xml.text(message.messageParts[0]);
    for (let i = 1; i < message.messageParts.length; i++) {
      xml.startTag(
        'ph',
        { name: message.placeholderNames[i - 1] },
        { selfClosing: true }
      );
      xml.text(message.messageParts[i]);
    }
  }
}
