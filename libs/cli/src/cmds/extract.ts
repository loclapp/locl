import * as fs from 'fs';
import * as glob from 'glob';
import { resolve } from 'path';
import { Diagnostics } from './common/diagnostics';
import { FileUtils } from './common/file_utils';
import { getTranslationSerializer, TranslationFormat } from './common/util';
import { Extractor } from './extract/extractor';

export const command = 'extract';
export const describe = 'Extract translations from your ivy application';
export const builder = {
  s: {
    alias: 'source',
    required: true,
    describe:
      'A glob pattern indicating what files to search for translations, e.g. `./dist/**/*.js`. This can be absolute or relative to the current working directory.'
  },
  f: {
    alias: 'format',
    required: true,
    describe: 'The format of the translation files to generate.',
    choices: ['json', 'xlf', 'xmb', 'xlf2'],
    default: 'json'
  },
  o: {
    alias: 'outputPath',
    required: true,
    describe:
      'A path to where the translation file will be written. This can be absolute or relative to the current working directory.'
  },
  l: {
    alias: 'locale',
    required: false,
    describe: 'The locale for the extracted file, "en" by default.'
  }
};

export const handler = function(options) {
  const diagnostics = new Diagnostics();
  extractTranslations({
    sourceGlob: options['s'] as string,
    format: options['f'] as TranslationFormat,
    outputPath: options['o'] as string,
    locale: options['l'] as string,
    diagnostics
  });
  diagnostics.messages.forEach(m => console.warn(`${m.type}: ${m.message}`));
  process.exit(diagnostics.hasErrors ? 1 : 0);
};

export interface ExtractTranslationsOptions {
  sourceGlob: string;
  format: TranslationFormat;
  outputPath: string;
  locale?: string;
  diagnostics: Diagnostics;
}

export function extractTranslations({
  sourceGlob: source,
  format,
  outputPath: output,
  locale,
  diagnostics
}: ExtractTranslationsOptions) {
  console.log(
    `Extracting translations from source "${source}" to format "${format}" and output "${output}"`
  );
  const filesToProcess = glob.sync(resolve(source), {
    absolute: true,
    nodir: true
  });

  const extractor = new Extractor(diagnostics);
  filesToProcess.forEach(file => {
    const contents = fs.readFileSync(file, 'utf8');
    extractor.extractMessages(contents);
  });

  const serializer = getTranslationSerializer(format);
  const translationFile = serializer.renderFile(
    extractor.messages,
    locale || 'en'
  );

  FileUtils.writeFile(resolve(output), translationFile);
}
