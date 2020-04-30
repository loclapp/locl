/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedMessage } from '@angular/localize';
import { ParsedMessageLegacy } from '../../../cmds/common/util';
import { TranslationSerializer } from './translation_serializer';
import { XmlFile } from './xml_file';

const DOCTYPE = `<!ELEMENT messagebundle (msg)*>
<!ATTLIST messagebundle class CDATA #IMPLIED>

<!ELEMENT msg (#PCDATA|ph|source)*>
<!ATTLIST msg id CDATA #IMPLIED>
<!ATTLIST msg seq CDATA #IMPLIED>
<!ATTLIST msg name CDATA #IMPLIED>
<!ATTLIST msg desc CDATA #IMPLIED>
<!ATTLIST msg meaning CDATA #IMPLIED>
<!ATTLIST msg obsolete (obsolete) #IMPLIED>
<!ATTLIST msg xml:space (default|preserve) "default">
<!ATTLIST msg is_hidden CDATA #IMPLIED>

<!ELEMENT source (#PCDATA)>

<!ELEMENT ph (#PCDATA|ex)*>
<!ATTLIST ph name CDATA #REQUIRED>

<!ELEMENT ex (#PCDATA)>`;

export class XmbTranslationSerializer implements TranslationSerializer {
  renderFile(messages: (ɵParsedMessage | ParsedMessageLegacy)[]): string {
    const xml = new XmlFile();
    xml.startTag('messagebundle');
    messages.forEach(message => {
      xml.startTag(
        'msg',
        {
          id:
            (message as ɵParsedMessage).id ||
            (message as ParsedMessageLegacy).messageId,
          desc: message.description,
          meaning: message.meaning
        },
        { preserveWhitespace: true }
      );
      this.renderMessage(xml, message);
      xml.endTag('msg', { preserveWhitespace: false });
    });
    xml.endTag('messagebundle');
    return xml.toString();
  }

  private renderMessage(
    xml: XmlFile,
    message: ɵParsedMessage | ParsedMessageLegacy
  ): void {
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
