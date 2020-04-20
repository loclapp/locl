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
    alias: ['locale', 'locales'],
    required: false,
    type: 'array',
    describe:
      'The locale for the extracted file, "en" by default. If you use multiple locales (e.g. "en fr es"), a new file will be generated for each locale'
  }
};

export const handler = function(options) {
  const diagnostics = new Diagnostics();
  extractTranslations({
    sourceGlob: options['s'] as string,
    format: options['f'] as TranslationFormat,
    outputPath: options['o'] as string,
    locales: options['l'] as string[],
    diagnostics
  });
  diagnostics.logMessages();
  process.exit(diagnostics.hasErrors ? 1 : 0);
};

export interface ExtractTranslationsOptions {
  sourceGlob: string;
  format: TranslationFormat;
  outputPath: string;
  locales?: string[];
  diagnostics: Diagnostics;
}

export function extractTranslations({
  sourceGlob: source,
  format,
  outputPath: output,
  locales = ['en'],
  diagnostics
}: ExtractTranslationsOptions) {
  console.log(`Extracting translations from "${source}"`);
  let filesToProcess = sync(resolve(source), {
    absolute: true,
    nodir: true
  });
  filesToProcess = FileUtils.dedup(filesToProcess, /\-es(5|2015)\./, '.');
  output = resolve(output);
  const generatedFiles: string[] = [];
  let isFile: boolean;
  try {
    const stat = statSync(output);
    isFile = stat.isFile();
  } catch (e) {
    isFile = !!extname(output);
  }
  if (isFile) {
    if (locales.length > 1) {
      diagnostics.error(
        `Multiple locales detected ("${locales.join(
          ','
        )}") but output "${output}" is not a directory`
      );
      return;
    }
    const res = makeTranslationsFile(
      filesToProcess,
      posix.normalize(output),
      source,
      format,
      locales[0],
      diagnostics
    );
    if (res) {
      generatedFiles.push(res);
    }
  } else {
    filesToProcess.forEach(file => {
      locales.forEach(locale => {
        const newFileName = posix.join(
          output,
          basename(file, '.js').replace(/-es(5|2015)/, '') +
            '.' +
            locale +
            '.' +
            getExtension(format)
        );
        const res = makeTranslationsFile(
          [file],
          newFileName,
          source,
          format,
          locale,
          diagnostics
        );
        if (res) {
          generatedFiles.push(res);
        }
      });
    });
  }
  if (!generatedFiles.length) {
    diagnostics.error(
      `No messages found. You should build the angular app without a language target for this command to work.`
    );
    return;
  }
}

function makeTranslationsFile(
  filesToProcess: string[],
  fileOutput: string,
  source: string,
  format: TranslationFormat,
  locale: string,
  diagnostics: Diagnostics
): string | null {
  const extractor = new Extractor(diagnostics);
  filesToProcess.forEach(file => {
    const contents = readFileSync(file, 'utf8');
    extractor.extractMessages(contents);
  });

  const serializer = getTranslationSerializer(format);
  if (extractor.messages.length > 0) {
    const translationFile = serializer.renderFile(
      extractor.messages,
      locale,
      false
    );
    FileUtils.writeFile(fileOutput, translationFile);
    console.log(`  Generated file "${fileOutput}"`);
    return fileOutput;
  }
  return null;
}
