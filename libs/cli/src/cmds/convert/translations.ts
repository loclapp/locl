import { ɵMessageId } from '@angular/localize';

/**
 * A translation message that has been processed to extract the message parts and placeholders.
 */
export interface ParsedTranslation {
  messageParts: TemplateStringsArray;
  placeholderNames: string[];
  description?: string;
  meaning?: string;
}

/**
 * The internal structure used by the runtime localization to translate messages.
 */
export declare type ParsedTranslations = Record<ɵMessageId, ParsedTranslation>;

/**
 * An object that holds translations that have been parsed from a translation file.
 */
export interface ParsedTranslationBundle {
  locale: string | undefined;
  translations: ParsedTranslations;
}
