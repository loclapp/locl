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
 * Indicates that a parser can parse a given file, with a hint that can be used to speed up actual
 * parsing.
 */
export interface CanParseAnalysis<Hint> {
  canParse: true;
  diagnostics: Diagnostics;
  hint: Hint;
}

/**
 * Indicates that a parser cannot parse a given file with diagnostics as why this is.
 * */
export interface CannotParseAnalysis {
  canParse: false;
  diagnostics: Diagnostics;
}

/**
 * Information about whether a `TranslationParser` can parse a given file.
 */
export type ParseAnalysis<Hint> = CanParseAnalysis<Hint> | CannotParseAnalysis;

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

  /**
   * Analyze the file to see if this parser can parse the given file.
   *
   * @param filePath The absolute path to the translation file.
   * @param contents The contents of the translation file.
   * @returns Information indicating whether the file can be parsed by this parser.
   */
  analyze(filePath: string, contents: string): ParseAnalysis<Hint>;
}
