import { Diagnostics } from './common/diagnostics';
import { TranslationFormat } from './common/util';
import { extractTranslations } from './extract/extract';

export const command = 'extract';
export const describe = 'Extract translations from your ivy application';
export const builder = {
  s: {
    alias: 'source',
    required: true,
    describe:
      'A glob pattern indicating what files to search for translations, e.g. `./dist/**/*.js`. This can be absolute or relative to the current working directory.',
  },
  f: {
    alias: 'format',
    required: true,
    describe: 'The format of the translation files to generate.',
    choices: ['json', 'xlf', 'xmb', 'xlf2'],
    default: 'json',
  },
  o: {
    alias: 'outputPath',
    required: true,
    describe:
      'A path to where the translation file will be written. This can be absolute or relative to the current working directory.',
  },
  l: {
    alias: ['locale', 'locales'],
    required: false,
    type: 'array',
    describe:
      'The locale for the extracted file, "en" by default. If you use multiple locales (e.g. "en fr es"), a new file will be generated for each locale',
  },
};

export const handler = function (options) {
  const diagnostics = new Diagnostics();
  extractTranslations({
    sourceGlob: options['s'] as string,
    format: options['f'] as TranslationFormat,
    outputPath: options['o'] as string,
    locales: options['l'] as string[],
    diagnostics,
  });
  diagnostics.logMessages();
  process.exit(diagnostics.hasErrors ? 1 : 0);
};
