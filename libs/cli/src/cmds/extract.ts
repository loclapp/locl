import * as fs from 'fs';
import * as glob from 'glob';
import { resolve } from 'path';
import { Extractor } from './extract/extractor';
import { FileUtils } from './extract/file_utils';
import { JsonTranslationSerializer } from './extract/translation_files/json_translation_serializer';
import { TranslationSerializer } from './extract/translation_files/translation_serializer';
import { Xliff1TranslationSerializer } from './extract/translation_files/xliff1_translation_serializer';
import { Xliff2TranslationSerializer } from './extract/translation_files/xliff2_translation_serializer';
import { XmbTranslationSerializer } from './extract/translation_files/xmb_translation_serializer';

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
  }
};

export const handler = function(options) {
  extractTranslations({
    sourceGlob: options['s'] as string,
    format: options['f'] as TranslationFormat,
    outputPath: options['o'] as string
  });
};

type TranslationFormat = 'json' | 'xmb' | 'xliff1' | 'xliff2' | 'xlf' | 'xlf2';

export interface ExtractTranslationsOptions {
  sourceGlob: string;
  format: TranslationFormat;
  outputPath: string;
}

export function extractTranslations({
  sourceGlob: source,
  format,
  outputPath: output
}: ExtractTranslationsOptions) {
  console.log('extracting translations', source, format, output);
  const filesToProcess = glob.sync(resolve(source), {
    absolute: true,
    nodir: true
  });

  const extractor = new Extractor();
  filesToProcess.forEach(file => {
    const contents = fs.readFileSync(file, 'utf8');
    extractor.extractMessages(contents, file);
  });

  const serializer = getTranslationSerializer(format);
  const translationFile = serializer.renderFile(extractor.messages);

  FileUtils.writeFile(resolve(output), translationFile);
}

function getTranslationSerializer(
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
  }
}
