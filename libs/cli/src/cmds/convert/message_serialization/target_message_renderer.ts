/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { MessageRenderer } from './message_renderer';
import { ParsedTranslation } from '../translations';

/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 */
export function makeParsedTranslation(
  messageParts: string[],
  placeholderNames: string[] = [],
  description?: string,
  meaning?: string
): ParsedTranslation {
  return {
    messageParts: makeTemplateObject(messageParts, messageParts),
    placeholderNames,
    description,
    meaning
  };
}

/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * @param cooked The message parts with their escape codes processed.
 * @param raw The message parts with their escaped codes as-is.
 */
export function makeTemplateObject(
  cooked: string[],
  raw: string[]
): TemplateStringsArray {
  Object.defineProperty(cooked, 'raw', { value: raw });
  return cooked as any;
}

/**
 * A message renderer that outputs `ParsedTranslation` objects.
 */
export class TargetMessageRenderer
  implements MessageRenderer<ParsedTranslation> {
  private current: MessageInfo = {
    messageParts: [],
    placeholderNames: [],
    text: ''
  };
  private icuDepth = 0;

  get message(): ParsedTranslation {
    const {
      messageParts,
      placeholderNames,
      description,
      meaning
    } = this.current;
    return makeParsedTranslation(
      messageParts,
      placeholderNames,
      description,
      meaning
    );
  }
  startRender(): void {}
  endRender(): void {
    this.storeMessagePart();
  }
  text(text: string): void {
    this.current.text += text;
  }
  description(description: string): void {
    this.current.description = description;
  }
  meaning(meaning: string): void {
    this.current.text = meaning;
  }
  placeholder(name: string, body: string | undefined): void {
    this.renderPlaceholder(name);
  }
  startPlaceholder(name: string): void {
    this.renderPlaceholder(name);
  }
  closePlaceholder(name: string): void {
    this.renderPlaceholder(name);
  }
  startContainer(): void {}
  closeContainer(): void {}
  startIcu(): void {
    this.icuDepth++;
    this.text('{');
  }
  endIcu(): void {
    this.icuDepth--;
    this.text('}');
  }
  private normalizePlaceholderName(name: string) {
    return name.replace(/-/g, '_');
  }
  private renderPlaceholder(name: string) {
    name = this.normalizePlaceholderName(name);
    if (this.icuDepth > 0) {
      this.text(`{${name}}`);
    } else {
      this.storeMessagePart();
      this.current.placeholderNames.push(name);
    }
  }
  private storeMessagePart() {
    this.current.messageParts.push(this.current.text);
    this.current.text = '';
  }
}

interface MessageInfo {
  messageParts: string[];
  placeholderNames: string[];
  text: string;
  description?: string;
  meaning?: string;
}
