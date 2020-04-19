import { readFileSync, statSync } from 'fs';
import { sync } from 'glob';
import { basename, extname, posix, resolve } from 'path';
import { Diagnostics } from './common/diagnostics';
import { FileUtils } from './common/file_utils';
import {
  getExtension,
  getTranslationSerializer,
  TranslationFormat
} from './common/util';
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
  diagnostics.logMessages();
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
  locale = 'en',
  diagnostics
}: ExtractTranslationsOptions) {
  console.log(`Extracting translations from "${source}"`);
  let filesToProcess = sync(resolve(source), {
    absolute: true,
    nodir: true
  });
  filesToProcess = FileUtils.dedup(filesToProcess, /\-es(5|2015)\./, '.');
  output = resolve(output);
  let isFile: boolean;
  try {
    const stat = statSync(output);
    isFile = stat.isFile();
  } catch (e) {
    isFile = !!extname(output);
  }
  if (isFile) {
    makeTranslationsFile(
      filesToProcess,
      posix.normalize(output),
      source,
      format,
      locale,
      diagnostics
    );
  } else {
    filesToProcess.forEach(file => {
      const newFileName = posix.join(
        output,
        basename(file, '.js').replace(/-es(5|2015)/, '') +
          '.' +
          locale +
          '.' +
          getExtension(format)
      );
      makeTranslationsFile(
        [file],
        newFileName,
        source,
        format,
        locale,
        diagnostics
      );
    });
  }
}

function makeTranslationsFile(
  filesToProcess: string[],
  fileOutput: string,
  source: string,
  format: TranslationFormat,
  locale: string,
  diagnostics: Diagnostics
) {
  const extractor = new Extractor(diagnostics);
  filesToProcess.forEach(file => {
    const contents = readFileSync(file, 'utf8');
    extractor.extractMessages(contents);
  });

  const serializer = getTranslationSerializer(format);
  if (extractor.messages.length > 0) {
    const translationFile = serializer.renderFile(extractor.messages, locale);
    FileUtils.writeFile(fileOutput, translationFile);
    console.log(`  Generated file "${fileOutput}"`);
  }
}
