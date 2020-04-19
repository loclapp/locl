/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Diagnostics } from '../../common/diagnostics';
import { ParsedTranslation } from '../translations';
import { ɵMessageId } from '@angular/localize';

/**
 * An object that holds translations that have been parsed from a translation file.
 */
export interface ParsedTranslationBundle {
  locale: string | undefined;
  sources?: Record<ɵMessageId, ParsedTranslation>;
  translations: Record<ɵMessageId, ParsedTranslation>;
  diagnostics: Diagnostics;
}

/**
 * Implement this interface to provide a class that can parse the contents of a translation file.
 */
export interface TranslationParser<Hint = true> {
  /**
   * Parses the given file, extracting the target locale and translations.
   *
   * @param filePath The absolute path to the translation file.
   * @param contents The contents of the translation file.
   */
  parse(filePath: string, contents: string): ParsedTranslationBundle;

  /**
   * Returns true if this parser can parse the given file.
   *
   * @param filePath The absolute path to the translation file.
   * @param contents The contents of the translation file.
   * @param hint A value that can be used by the parser to speed up parsing of the file. This will
   * have been provided as the return result from calling `canParse()`.
   */
  canParse(filePath: string, contents: string, hint: Hint): Hint | false;
}
