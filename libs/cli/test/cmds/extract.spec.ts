import { extractTranslations } from '@locl/cli';
import { Diagnostics } from '@locl/cli/src/cmds/common/diagnostics';
import { mockFile, sourceXlf } from '@locl/cli/test/cmds/mock';
import { FileUtils } from '../../src/cmds/common/file_utils';

describe('extract', () => {
  it('should work', () => {
    mockFile(['main-es2015.js', '/i18/en.xlf'], [mainEs2015]);
    const spy = spyOn(FileUtils, 'writeFile');

    extractTranslations({
      format: 'xlf',
      sourceGlob: 'main-es2015.js',
      outputPath: '/i18/en.xlf',
      diagnostics: new Diagnostics()
    });

    expect(spy).toHaveBeenCalledWith('/i18/en.xlf', sourceXlf);
  });

  it('should create files automatically if output is a folder', () => {
    mockFile(['main-es2015.js', '/i18'], [mainEs2015]);
    const spy = spyOn(FileUtils, 'writeFile');

    extractTranslations({
      format: 'xlf',
      sourceGlob: 'main-es2015.js',
      outputPath: '/i18',
      diagnostics: new Diagnostics()
    });

    expect(spy).toHaveBeenCalledWith('/i18/main.en.xlf', sourceXlf);
  });
});

const mainEs2015 = `
var I18N_0;
if (typeof ngI18nClosureMode !== "undefined" && ngI18nClosureMode) {
    const MSG_EXTERNAL_5105652583545451042$$APPS_DEMO_SRC_APP_APP_COMPONENT_TS_1 = goog.getMsg("It works!");
    I18N_0 = MSG_EXTERNAL_5105652583545451042$$APPS_DEMO_SRC_APP_APP_COMPONENT_TS_1;
}
else {
  I18N_0 = $localize \`:site header|An introduction header for this sample␟7e1a20ccc16692f73c6e224b489dc7e275ecc6ed␟3987846127133982403:It works!\`;
}
const name = '$localize';
const lib = 'Locl';
class AppComponent {
    constructor() {
        this.title = $localize \`Welcome to the demo of \${name} and \${lib} made for \${name}!\`;
        console.log($localize \`:@@foo:custom id!\`);
    }
}`;
