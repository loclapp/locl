import { JsonTranslationSerializer } from '../extract/translation_files/json_translation_serializer';
import { TranslationSerializer } from '../extract/translation_files/translation_serializer';
import { Xliff1TranslationSerializer } from '../extract/translation_files/xliff1_translation_serializer';
import { Xliff2TranslationSerializer } from '../extract/translation_files/xliff2_translation_serializer';
import { XmbTranslationSerializer } from '../extract/translation_files/xmb_translation_serializer';
import { ɵParsedMessage } from '@angular/localize';
import { ParsedTranslation } from '../convert/translations';
import { XtbTranslationSerializer } from '../extract/translation_files/xtb_translation_serializer';

export type TranslationFormat =
  | 'json'
  | 'xmb'
  | 'xliff1'
  | 'xliff2'
  | 'xlf'
  | 'xlf2'
  | 'xtb';

export function getTranslationSerializer(
  format: TranslationFormat
): TranslationSerializer {
  switch (format) {
    case 'json':
      return new JsonTranslationSerializer();
    case 'xliff1':
    case 'xlf':
      return new Xliff1TranslationSerializer();
    case 'xliff2':
    case 'xlf2':
      return new Xliff2TranslationSerializer();
    case 'xmb':
      return new XmbTranslationSerializer();
    case 'xtb':
      return new XtbTranslationSerializer();
  }
}

export function getExtension(format: TranslationFormat): string {
  switch (format) {
    case 'json':
    case 'xmb':
    case 'xtb':
      return format;
    default:
      return 'xlf';
  }
}

/**
 * The character used to mark the start and end of a "block" in a `$localize` tagged string.
 * A block can indicate metadata about the message or specify a name of a placeholder for a
 * substitution expressions.
 *
 * For example:
 *
 * ```ts
 * $localize`Hello, ${title}:title:!`;
 * $localize`:meaning|description@@id:source message text`;
 * ```
 */
export const BLOCK_MARKER = ':';

/**
 * Find the end of a "marked block" indicated by the first non-escaped colon.
 *
 * @param cooked The cooked string (where escaped chars have been processed)
 * @param raw The raw string (where escape sequences are still in place)
 *
 * @returns the index of the end of block marker
 * @throws an error if the block is unterminated
 */
export function findEndOfBlock(cooked: string, raw: string): number {
  /************************************************************************************************
   * This function is repeated in `src/localize/src/localize.ts` and the two should be kept in sync.
   * (See that file for more explanation of why.)
   ************************************************************************************************/
  for (
    let cookedIndex = 1, rawIndex = 1;
    cookedIndex < cooked.length;
    cookedIndex++, rawIndex++
  ) {
    if (raw[rawIndex] === '\\') {
      rawIndex++;
    } else if (cooked[cookedIndex] === BLOCK_MARKER) {
      return cookedIndex;
    }
  }
  throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}

/**
 * Split a message part (`cooked` + `raw`) into an optional delimited "block" off the front and the
 * rest of the text of the message part.
 *
 * Blocks appear at the start of message parts. They are delimited by a colon `:` character at the
 * start and end of the block.
 *
 * If the block is in the first message part then it will be metadata about the whole message:
 * meaning, description, id.  Otherwise it will be metadata about the immediately preceding
 * substitution: placeholder name.
 *
 * Since blocks are optional, it is possible that the content of a message block actually starts
 * with a block marker. In this case the marker must be escaped `\:`.
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns An object containing the `text` of the message part and the text of the `block`, if it
 * exists.
 * @throws an error if the `block` is unterminated
 */
export function splitBlock(
  cooked: string,
  raw: string
): { text: string; block?: string } {
  if (raw.charAt(0) !== BLOCK_MARKER) {
    return { text: cooked };
  } else {
    const endOfBlock = findEndOfBlock(cooked, raw);
    return {
      block: cooked.substring(1, endOfBlock),
      text: cooked.substring(endOfBlock + 1)
    };
  }
}

function computePlaceholderName(index: number) {
  return index === 1 ? 'PH' : `PH_${index - 1}`;
}

export function translationToMessage(
  messageId: string,
  translation: ParsedTranslation
): ɵParsedMessage {
  const messageParts = translation.messageParts;
  const legacyIds = [];
  const cleanedMessageParts: string[] = [messageParts[0]];
  const substitutions: { [placeholderName: string]: any } = {};
  const placeholderNames: string[] = [];
  let messageString = messageParts[0];

  for (let i = 1; i < messageParts.length; i++) {
    const {
      text: messagePart,
      block: placeholderName = translation.placeholderNames[i - 1] ||
        computePlaceholderName(i)
    } = splitBlock(messageParts[i], messageParts.raw[i]);
    messageString += `{$${placeholderName}}${messagePart}`;
    if (translation.placeholderNames.length) {
      substitutions[placeholderName] = translation.placeholderNames[i - 1];
    }
    placeholderNames.push(placeholderName);
    cleanedMessageParts.push(messagePart);
  }

  return {
    messageId,
    legacyIds,
    substitutions,
    messageString,
    meaning: translation.meaning || '',
    description: translation.description || '',
    messageParts: cleanedMessageParts,
    placeholderNames
  };
}
