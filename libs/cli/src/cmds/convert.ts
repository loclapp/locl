import { TranslationLoader } from '@angular/localize/src/tools/src/translate/translation_files/translation_loader';
import * as glob from 'glob';
import { resolve } from 'path';
import { Diagnostics } from './common/diagnostics';
import { FileUtils } from './common/file_utils';
import { getTranslationSerializer, translationToMessage } from './common/util';
import { SimpleJsonTranslationParser } from './convert/translation_parsers/simple_json_translation_parser';
import { Xliff1TranslationParser } from './convert/translation_parsers/xliff1_translation_parser';
import { Xliff2TranslationParser } from './convert/translation_parsers/xliff2_translation_parser';
import { XtbTranslationParser } from './convert/translation_parsers/xtb_translation_parser';

export const command = 'convert';
export const describe = 'Convert translation files from one format to another';
export const builder = {
  s: {
    alias: 'source',
    required: true,
    describe:
      'A glob pattern indicating what files to convert, e.g. `./assets/**/*.xlf`. This can be absolute or relative to the current working directory. Only translation files are supported (json, xtb & xlf but not xmb).'
  },
  f: {
    alias: 'format',
    required: true,
    describe: 'The format of the translation files to generate.',
    choices: ['json', 'xlf', 'xtb', 'xlf2'],
    default: 'json'
  },
  o: {
    alias: 'outputPath',
    required: true,
    describe:
      'A path to where the converted files will be written. This can be absolute or relative to the current working directory.'
  }
};

export const handler = function(options) {
  const diagnostics = new Diagnostics();
  convertFiles({
    sourceGlob: options['s'] as string,
    format: options['f'] as TranslationFormat,
    outputPath: options['o'] as string,
    diagnostics
  });
  diagnostics.messages.forEach(m => console.warn(`${m.type}: ${m.message}`));
  process.exit(diagnostics.hasErrors ? 1 : 0);
};

type TranslationFormat = 'json' | 'xtb' | 'xliff1' | 'xliff2' | 'xlf' | 'xlf2';

export interface ConvertFilesOptions {
  sourceGlob: string;
  format: TranslationFormat;
  outputPath: string;
  diagnostics: Diagnostics;
}

export function convertFiles({
  sourceGlob: source,
  format,
  outputPath: output,
  diagnostics
}: ConvertFilesOptions) {
  console.log(
    `Converting files from source "${source}" to format "${format}" and output "${output}"`
  );
  const filesToProcess = glob.sync(resolve(source), {
    absolute: true,
    nodir: true
  });

  const translationLoader = new TranslationLoader(
    [
      new Xliff2TranslationParser(),
      new Xliff1TranslationParser(),
      new XtbTranslationParser(diagnostics),
      new SimpleJsonTranslationParser()
    ],
    diagnostics
  );

  const translationBundles = translationLoader.loadBundles(filesToProcess, []);
  const messages = [];
  translationBundles.forEach(translationBundle => {
    const translations = translationBundle.translations;
    messages.push(
      ...Object.keys(translations).map(id =>
        translationToMessage(id, translations[id])
      )
    );
  });

  const serializer = getTranslationSerializer(format);
  const translationFile = serializer.renderFile(
    messages,
    translationBundles[0].locale,
    true
  );

  FileUtils.writeFile(resolve(output), translationFile);
}
