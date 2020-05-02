module.exports = {
  name: 'web-demo',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/web-demo',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
