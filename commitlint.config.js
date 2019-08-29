module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
  plugins: ['commitlint-plugin-body-content'],
  rules: {
    'body-content': [2, 'always', ['affect:', ['fix', 'feat', 'perf']]]
  }
};
