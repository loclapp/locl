import { NodeJSFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { TranslationLoader } from '@angular/localize/src/tools/src/translate/translation_files/translation_loader';
import { Diagnostics } from '../common/diagnostics';
import { FileUtils } from '../common/file_utils';
import { getTranslationSerializer, translationToMessage } from '../common/util';
import { SimpleJsonTranslationParser } from '../convert/translation_parsers/simple_json_translation_parser';
import { Xliff1TranslationParser } from '../convert/translation_parsers/xliff1_translation_parser';
import { Xliff2TranslationParser } from '../convert/translation_parsers/xliff2_translation_parser';
import { XtbTranslationParser } from '../convert/translation_parsers/xtb_translation_parser';
import * as glob from 'glob';
import { posix } from 'path';

export type TranslationFormat =
  | 'json'
  | 'xtb'
  | 'xliff1'
  | 'xliff2'
  | 'xlf'
  | 'xlf2';

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
  diagnostics,
}: ConvertFilesOptions) {
  console.log(
    `Converting files from source "${source}" to format "${format}" and output "${output}"`
  );
  const filesToProcess = glob.sync(source, {
    absolute: true,
    nodir: true,
  });

  const fs = new NodeJSFileSystem();

  const translationLoader = new TranslationLoader(
    fs,
    [
      new Xliff2TranslationParser(diagnostics),
      new Xliff1TranslationParser(diagnostics),
      new XtbTranslationParser(diagnostics),
      new SimpleJsonTranslationParser(diagnostics),
    ],
    'ignore',
    diagnostics
  );

  // Convert all the `translationFilePaths` elements to arrays.
  const translationFilePathsArrays = filesToProcess.map((filePaths) =>
    Array.isArray(filePaths)
      ? filePaths.map((p) => fs.resolve(p))
      : [fs.resolve(filePaths)]
  );

  const translationBundles = translationLoader.loadBundles(
    translationFilePathsArrays,
    []
  );
  if (translationBundles.length) {
    const messages = [];
    translationBundles.forEach((translationBundle) => {
      const translations = translationBundle.translations;
      messages.push(
        ...Object.keys(translations).map((id) =>
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

    FileUtils.writeFile(posix.normalize(output), translationFile);
  } else {
    diagnostics.error(`Couldn't find any file to convert.`);
  }
}
