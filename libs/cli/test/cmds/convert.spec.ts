import { convertFiles } from '../../src/cmds/convert/convert';
import { Diagnostics } from '../../src/cmds/common/diagnostics';
import {
  mockFile,
  simpleTranslatedXlf,
  translatedJSON,
  translatedXlf,
  translatedXLF2,
  translatedXtb,
} from './mock';
import { FileUtils } from '../../src/cmds/common/file_utils';
import { runInEachFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system/testing';

runInEachFileSystem(() => {
  describe('convertFiles', () => {
    it('should convert xlf to json', function () {
      mockFile(['fr.xlf', '/i18n/fr.json'], [translatedXlf]);
      const spy = spyOn(FileUtils, 'writeFile');

      convertFiles({
        format: 'json',
        sourceGlob: 'fr.xlf',
        outputPath: '/i18n/fr.json',
        diagnostics: new Diagnostics(),
      });

      expect(spy).toHaveBeenCalledWith('/i18n/fr.json', translatedJSON);
    });

    it('should convert json to xlf', function () {
      mockFile(['fr.json', '/i18n/fr.xlf'], [translatedJSON]);
      const spy = spyOn(FileUtils, 'writeFile');

      convertFiles({
        format: 'xlf',
        sourceGlob: 'fr.json',
        outputPath: '/i18n/fr.xlf',
        diagnostics: new Diagnostics(),
      });

      expect(spy).toHaveBeenCalledWith('/i18n/fr.xlf', simpleTranslatedXlf);
    });

    it('should convert xlf to xtb', function () {
      mockFile(['fr.xlf', '/i18n/fr.xtb'], [translatedXlf]);
      const spy = spyOn(FileUtils, 'writeFile');

      convertFiles({
        format: 'xtb',
        sourceGlob: 'fr.xlf',
        outputPath: '/i18n/fr.xtb',
        diagnostics: new Diagnostics(),
      });

      expect(spy).toHaveBeenCalledWith('/i18n/fr.xtb', translatedXtb);
    });

    it('should convert xtb to xlf2', function () {
      mockFile(['fr.xtb', '/i18n/fr.xlf'], [translatedXtb]);
      const spy = spyOn(FileUtils, 'writeFile');

      convertFiles({
        format: 'xlf2',
        sourceGlob: 'fr.xtb',
        outputPath: '/i18n/fr.xlf',
        diagnostics: new Diagnostics(),
      });

      expect(spy).toHaveBeenCalledWith('/i18n/fr.xlf', translatedXLF2);
    });
  });
});
