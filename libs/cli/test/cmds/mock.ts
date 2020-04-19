import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

export function mockFile(filePath: string[], fileContent?: string[]) {
  const sync = glob.sync;
  spyOn(glob, 'sync').and.callFake((pattern, options) => {
    const index = filePath.indexOf(pattern);
    if (filePath.indexOf(pattern) !== -1) {
      return [filePath[index]];
    } else {
      return sync(pattern, options);
    }
  });
  const resolve = path.resolve;
  spyOn(path, 'resolve').and.callFake((...pathSegments: string[]) => {
    const index = filePath.indexOf(pathSegments[0]);
    if (index !== -1) {
      return filePath[index];
    } else {
      return resolve(...pathSegments);
    }
  });
  if (fileContent) {
    const readFileSync = fs.readFileSync;
    spyOn(fs, 'readFileSync').and.callFake((p: string, options) => {
      const index = filePath.indexOf(p);
      if (index !== -1) {
        return fileContent[index];
      } else {
        return readFileSync(p, options);
      }
    });
  }
}

export const sourceXlf = `<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext">
    <body>
      <trans-unit id="3987846127133982403" datatype="html">
        <source>It works!</source>
        <note priority="1" from="description">An introduction header for this sample</note>
        <note priority="1" from="meaning">site header</note>
      </trans-unit>
      <trans-unit id="6586379816467235622" datatype="html">
        <source>Welcome to the demo of <x id="PH"/> and <x id="PH_1"/> made for <x id="PH_2"/>!</source>
      </trans-unit>
      <trans-unit id="foo" datatype="html">
        <source>custom id!</source>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

export const translatedXlf = `
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file target-language="fr" datatype="plaintext">
    <body>
      <trans-unit id="3987846127133982403" datatype="html">
        <source>It works! <x id="INTERPOLATION"/></source>
        <target>Ça fonctionne! <x id="INTERPOLATION"/></target>
        <note priority="1" from="description">An introduction header for this sample</note>
        <note priority="1" from="meaning">site header</note>
      </trans-unit>
      <trans-unit id="4571727307714732203" datatype="html">
        <source>Welcome to the demo of <x id="PH"/> and <x id="PH_1"/> made for <x id="PH_2"/>!</source>
        <target>Bienvenue à la démo de <x id="PH"/> et <x id="PH_1"/> fait pour <x id="PH_2"/>!</target>
      </trans-unit>
      <trans-unit id="foo" datatype="html">
        <source>custom id!</source>
        <target>id personnalisé!</target>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

export const translatedXLF2 = `<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="fr" trgLang="fr">
  <file>
    <unit id="3987846127133982403">
      <segment>
        <target>Ça fonctionne! <ph id="1" equiv="INTERPOLATION"/></target>
      </segment>
    </unit>
    <unit id="4571727307714732203">
      <segment>
        <target>Bienvenue à la démo de <ph id="1" equiv="PH"/> et <ph id="2" equiv="PH_1"/> fait pour <ph id="3" equiv="PH_2"/>!</target>
      </segment>
    </unit>
    <unit id="foo">
      <segment>
        <target>id personnalisé!</target>
      </segment>
    </unit>
  </file>
</xliff>
`;

export const simpleTranslatedXlf = `<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file target-language="fr" datatype="plaintext">
    <body>
      <trans-unit id="3987846127133982403" datatype="html">
        <target>Ça fonctionne! <x id="INTERPOLATION"/></target>
      </trans-unit>
      <trans-unit id="4571727307714732203" datatype="html">
        <target>Bienvenue à la démo de <x id="PH"/> et <x id="PH_1"/> fait pour <x id="PH_2"/>!</target>
      </trans-unit>
      <trans-unit id="foo" datatype="html">
        <target>id personnalisé!</target>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

export const translatedJSON = `{
  "locale": "fr",
  "translations": {
    "3987846127133982403": "Ça fonctionne! {$INTERPOLATION}",
    "4571727307714732203": "Bienvenue à la démo de {$PH} et {$PH_1} fait pour {$PH_2}!",
    "foo": "id personnalisé!"
  }
}`;

export const translatedXtb = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE translationbundle [
<!ELEMENT translationbundle (translation)*>
<!ATTLIST translationbundle lang CDATA #REQUIRED>

<!ELEMENT translation (#PCDATA|ph)*>
<!ATTLIST translation id CDATA #REQUIRED>
<!ATTLIST translation desc CDATA #IMPLIED>
<!ATTLIST translation meaning CDATA #IMPLIED>
<!ATTLIST translation xml:space (default|preserve) "default">

<!ELEMENT ph (#PCDATA|ex)*>
<!ATTLIST ph name CDATA #REQUIRED>

<!ELEMENT ex (#PCDATA)>
]>
<translationbundle lang="fr">
  <translation id="3987846127133982403" desc="An introduction header for this sample" meaning="site header">Ça fonctionne! <ph name="INTERPOLATION"/></translation>
  <translation id="4571727307714732203">Bienvenue à la démo de <ph name="PH"/> et <ph name="PH_1"/> fait pour <ph name="PH_2"/>!</translation>
  <translation id="foo">id personnalisé!</translation>
</translationbundle>
`;
