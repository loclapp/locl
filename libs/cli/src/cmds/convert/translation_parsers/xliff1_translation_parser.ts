/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Element, Node, XmlParser, visitAll, Text } from '@angular/compiler';
import { ɵMessageId } from '@angular/localize';
import { Diagnostics } from '../../common/diagnostics';
import { BaseVisitor } from '@angular/localize/src/tools/src/translate/translation_files/base_visitor';

import { MessageSerializer } from '../message_serialization/message_serializer';
import { TargetMessageRenderer } from '../message_serialization/target_message_renderer';
import { TranslationParseError } from './translation_parse_error';
import {
  ParseAnalysis,
  ParsedTranslationBundle,
  TranslationParser,
} from './translation_parser';
import {
  getAttrOrThrow,
  getAttribute,
  parseInnerRange,
  canParseXml,
  XmlTranslationParserHint,
} from './translation_utils';
import { ParsedTranslation } from '../translations';

/**
 * A translation parser that can load XLIFF 1.2 files.
 *
 * http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
 * http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
 *
 */
export class Xliff1TranslationParser
  implements TranslationParser<XmlTranslationParserHint> {
  constructor(private diagnostics: Diagnostics) {}

  canParse(
    filePath: string,
    contents: string
  ): XmlTranslationParserHint | false {
    const result = this.analyze(filePath, contents);
    return result.canParse && result.hint;
  }

  analyze(
    filePath: string,
    contents: string
  ): ParseAnalysis<XmlTranslationParserHint> {
    return canParseXml(filePath, contents, 'xliff', { version: '1.2' });
  }

  parse(filePath: string, contents: string): ParsedTranslationBundle {
    const xmlParser = new XmlParser();
    const xml = xmlParser.parse(contents, filePath);
    const bundle = XliffFileElementVisitor.extractBundle(
      xml.rootNodes,
      this.diagnostics
    );
    if (bundle === undefined) {
      throw new Error(`Unable to parse "${filePath}" as XLIFF 1.2 format.`);
    }
    return bundle;
  }
}

class XliffFileElementVisitor extends BaseVisitor {
  private bundle: ParsedTranslationBundle | undefined;

  constructor(private diagnostics: Diagnostics) {
    super();
  }

  static extractBundle(
    xliff: Node[],
    diagnostics: Diagnostics
  ): ParsedTranslationBundle | undefined {
    const visitor = new this(diagnostics);
    visitAll(visitor, xliff);
    return visitor.bundle;
  }

  visitElement(element: Element): any {
    if (element.name === 'file') {
      this.bundle = {
        locale: getAttribute(element, 'target-language'),
        translations: XliffTranslationVisitor.extractTranslations(element),
        diagnostics: this.diagnostics,
      };
    } else {
      return visitAll(this, element.children);
    }
  }
}

class XliffTranslationVisitor extends BaseVisitor {
  private translations: Record<ɵMessageId, ParsedTranslation> = {};

  static extractTranslations(file: Element): Record<string, ParsedTranslation> {
    const visitor = new this();
    visitAll(visitor, file.children);
    return visitor.translations;
  }

  visitElement(element: Element): any {
    if (element.name === 'trans-unit') {
      const id = getAttrOrThrow(element, 'id');
      if (this.translations[id] !== undefined) {
        throw new TranslationParseError(
          element.sourceSpan,
          `Duplicated translations for message "${id}"`
        );
      }

      let meaning, description;
      element.children.forEach((el) => {
        if (isTargetElement(el)) {
          this.translations[id] = serializeTargetMessage(el);
        } else if (isSourceElement(el) && !this.translations[id]) {
          this.translations[id] = serializeTargetMessage(el);
        } else if (isNoteElement(el)) {
          const from = el.attrs.find((attr) => attr.name === 'from');
          if (el.children.length) {
            const value = (el.children[0] as Text).value;
            if (from.value === 'description') {
              description = value;
            } else if (from.value === 'meaning') {
              meaning = value;
            }
          }
        }
      });

      if (this.translations[id] === undefined) {
        throw new TranslationParseError(
          element.sourceSpan,
          'Missing required <target> element'
        );
      } else {
        if (description) {
          this.translations[id].description = description;
        }
        if (meaning) {
          this.translations[id].meaning = meaning;
        }
      }
    } else {
      return visitAll(this, element.children);
    }
  }
}

function serializeTargetMessage(source: Element): ParsedTranslation {
  const serializer = new MessageSerializer(new TargetMessageRenderer(), {
    inlineElements: ['g', 'bx', 'ex', 'bpt', 'ept', 'ph', 'it', 'mrk'],
    placeholder: { elementName: 'x', nameAttribute: 'id' },
  });
  return serializer.serialize(parseInnerRange(source));
}

function isSourceElement(node: Node): node is Element {
  return node instanceof Element && node.name === 'source';
}

function isTargetElement(node: Node): node is Element {
  return node instanceof Element && node.name === 'target';
}

function isNoteElement(node: Node): node is Element {
  return node instanceof Element && node.name === 'note';
}
