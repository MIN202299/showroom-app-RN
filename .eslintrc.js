module.exports = {
  extends: [
    '@dcwjoy',
  ],
  rules: {
    'unused-imports/no-unused-imports': 'off',
    'import/named': 'off',
    'no-console': 'off',
  },
  ignorePatterns: [
    '%ProgramData%/*',
    '*.otf',
    'assets/*',
  ],
}
