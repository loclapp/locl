import { Diagnostics } from '../common/diagnostics';
import { FileUtils } from '../common/file_utils';
import {
  getExtension,
  getTranslationSerializer,
  TranslationFormat,
} from '../common/util';
import { Extractor } from './extractor';
import { readFileSync, statSync } from 'fs';
import { sync } from 'glob';
import { basename, extname, posix, resolve } from 'path';

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
  diagnostics,
}: ExtractTranslationsOptions) {
  console.log(`Extracting translations from "${source}"`);
  let filesToProcess = sync(resolve(source), {
    absolute: true,
    nodir: true,
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
    filesToProcess.forEach((file) => {
      locales.forEach((locale) => {
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
  filesToProcess.forEach((file) => {
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
