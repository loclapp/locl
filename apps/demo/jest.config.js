module.exports = {
  name: 'web-demo',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/web-demo',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
