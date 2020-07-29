import { convertFiles, TranslationFormat } from './convert/convert';
import { resolve } from 'path';
import { Diagnostics } from './common/diagnostics';

export const command = 'convert';
export const describe = 'Convert translation files from one format to another';
export const builder = {
  s: {
    alias: 'source',
    required: true,
    describe:
      'A glob pattern indicating what files to convert, e.g. `./assets/**/*.xlf`. This can be absolute or relative to the current working directory. Only translation files are supported (json, xtb & xlf but not xmb).',
  },
  f: {
    alias: 'format',
    required: true,
    describe: 'The format of the translation files to generate.',
    choices: ['json', 'xlf', 'xtb', 'xlf2'],
    default: 'json',
  },
  o: {
    alias: 'outputPath',
    required: true,
    describe:
      'A path to where the converted files will be written. This can be absolute or relative to the current working directory.',
  },
};

export const handler = function (options) {
  const diagnostics = new Diagnostics();
  convertFiles({
    sourceGlob: resolve(options['s']),
    format: options['f'] as TranslationFormat,
    outputPath: resolve(options['o']),
    diagnostics,
  });
  diagnostics.logMessages();
  process.exit(diagnostics.hasErrors ? 1 : 0);
};
